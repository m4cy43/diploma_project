const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Userbook = require("../models/userBookModel");
const { Op } = require("sequelize");

// @desc    Create new user
// @route   POST /api/user/register
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { email, password, name, surname, middlename, phone } = req.body;

  // Check the value
  if (!email || !password) {
    res.status(400);
    throw new Error("Required values are missing");
  }

  let newPhone = phone;
  if (phone === "") {
    newPhone = null;
  }

  // Check if user exists by email and phone
  const checkIfUserExists = await User.findOne({ where: { email } });
  if (checkIfUserExists) {
    res.status(400);
    throw new Error("The user already exists");
  }

  // Check if phone exists
  if (newPhone) {
    const phoneExists = await User.findOne({ where: { phone: newPhone } });
    if (phoneExists) {
      res.status(400);
      throw new Error("User with such phone already exists");
    }
  }

  // Encryption & hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.toString(), salt);

  const membership = generateMembership(10);

  // Create new user
  const user = await User.create({
    email: email,
    password: hash,
    membership: membership,
    name: name,
    surname: surname,
    middlename: middlename,
    phone: newPhone,
  });
  if (user) {
    // Add role to user
    const role = await Role.findOrCreate({ where: { role: "unverified" } });
    await user.addRole(role[0]);

    res.status(201).json({
      // uuid: user.uuid,
      email: user.email,
      // membership: user.membership,
      // name: user.name,
      // surname: user.surname,
      // middlename: user.middlename,
      // phone: user.phone,
      // roles: [role[0].role],
      token: generateJWT(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user by email
  // Check the password
  const user = await User.findOne({
    where: { email },
    // include: [
    //   { model: Role, attributes: ["role"], through: { attributes: [] } },
    // ],
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      // uuid: user.uuid,
      email: user.email,
      // membership: user.membership,
      // name: user.name,
      // surname: user.surname,
      // middlename: user.middlename,
      // phone: user.phone,
      // roles: user.roles.map((x) => x.role),
      token: generateJWT(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error("Wrong email or password");
  }
});

// @desc    Return auth user
// @route   GET /api/user/authuser
// @access  Private
const getAuthUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Return full user data
// @route   GET /api/user/full
// @access  Private
const getAuthFullData = asyncHandler(async (req, res) => {
  res.status(200).json({
    email: req.user.email,
    membership: req.user.membership,
    name: req.user.name,
    surname: req.user.surname,
    middlename: req.user.middlename,
    phone: req.user.phone,
  });
});

// @desc    Return auth user roles
// @route   GET /api/user/roles
// @access  Private
const getAuthRoles = asyncHandler(async (req, res) => {
  res.status(200).json(req.user.roles);
});

// @desc    Verify the user
// @route   PUT /api/user/verify/{uuid}
// @access  Private
const verifyUser = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const newrole = await Role.findOrCreate({ where: { role: "verified" } });
  await user.addRole(newrole[0]);
  const roleToDel = await Role.findOne({ where: { role: "unverified" } });
  if (roleToDel) await user.removeRole(roleToDel);

  res.status(204).json();
});

// @desc    Set admin rights
// @route   PUT /api/user/setadmin/{uuid}
// @access  Private
const setAdmin = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("main")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const newrole = await Role.findOrCreate({ where: { role: "admin" } });
  await user.addRole(newrole[0]);

  res.status(204).json();
});

// @desc    Delete admin rights
// @route   DELETE /api/user/deladmin/{uuid}
// @access  Private
const delAdmin = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("main")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const roleToDel = await Role.findOne({ where: { role: "admin" } });
  if (roleToDel) await user.removeRole(roleToDel);

  res.status(204).json();
});

// @desc    Set superadmin rights
// @route   PUT /api/user/setsuper/{uuid}
// @access  Private
const setSuperAdmin = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("super")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const newrole = await Role.findOrCreate({ where: { role: "super" } });
  await user.addRole(newrole[0]);

  res.status(204).json();
});

// @desc    Delete auth user
// @route   DELETE /api/user/
// @access  Private
const deleteMe = asyncHandler(async (req, res) => {
  let user = await User.findByPk(req.user.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  let debtArr = await Userbook.findAll({
    where: {
      userUuid: req.user.uuid,
      type: { [Op.or]: ["reservation", "debt"] },
    },
  });
  if (debtArr.length > 0) {
    res.status(400);
    throw new Error("User have debts or reservations");
  }

  await user.destroy();
  res.status(204).json();
});

// @desc    Delete the user
// @route   DELETE /api/user/{uuid}
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  let userIsAdmin = await user.getRoles();
  if (userIsAdmin.filter((x) => x.role == "admin").length > 0) {
    res.status(400);
    throw new Error("User have admin rights");
  }

  let debtArr = await Userbook.findAll({
    where: {
      userUuid: req.params.uuid,
      type: { [Op.or]: ["reservation", "debt"] },
    },
  });
  if (debtArr.length > 0) {
    res.status(400);
    throw new Error("User have debts or reservations");
  }

  await user.destroy();
  res.status(204).json();
});

// @desc    Update auth user
// @route   PUT /api/user/
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { email, password, oldPassword, name, surname, middlename, phone } =
    req.body;
  // Check the value
  if (!email || !password) {
    res.status(400);
    throw new Error("Required values are missing");
  }

  let newPhone = phone;
  if (phone === "") {
    newPhone = null;
  }

  // Check the user exists
  let user = await User.findByPk(req.user.uuid);
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const matchPass = await bcrypt.compare(oldPassword, user.password);
  if (!matchPass) {
    res.status(401);
    throw new Error("Wrong old password");
  }

  // Check if user exists by email
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists && user.email !== email) {
    res.status(400);
    throw new Error("User with such email already exists");
  }
  // Check if phone exists
  if (newPhone) {
    const phoneExists = await User.findOne({ where: { phone: newPhone } });
    if (phoneExists && user.phone !== newPhone) {
      res.status(400);
      throw new Error("User with such phone already exists");
    }
  }

  // Encryption & hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.toString(), salt);

  // Remove verified role if name/surname/middlename is changed
  if (
    (name && user.name !== name) ||
    (surname && user.surname !== surname) ||
    (middlename && user.middlename !== middlename)
  ) {
    const roleToDel = await Role.findOne({ where: { role: "verified" } });
    if (roleToDel) await user.removeRole(roleToDel);
    const newrole = await Role.findOrCreate({ where: { role: "unverified" } });
    await user.addRole(newrole[0]);
  }

  user.set({
    email: email,
    password: hash,
    // membership: membership,
    name: name,
    surname: surname,
    middlename: middlename,
    phone: newPhone,
  });

  await user.save();
  await user.reload();
  if (user) {
    res.status(201).json({
      // uuid: user.uuid,
      email: user.email,
      // membership: user.membership,
      // name: user.name,
      // surname: user.surname,
      // middlename: user.middlename,
      // phone: user.phone,
      token: generateJWT(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Update the user
// @route   PUT /api/user/{uuid}
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const { name, surname, middlename, phone } = req.body;
  // Check the value
  if (!name || !surname) {
    res.status(400);
    throw new Error("Required values are missing");
  }
  let newPhone = phone;
  if (phone === "") {
    newPhone = null;
  }

  // Check the user exists
  let user = await User.findByPk(req.params.uuid);
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }
  // Check if phone exists
  if (newPhone) {
    const phoneExists = await User.findOne({ where: { phone: newPhone } });
    if (phoneExists && user.phone !== newPhone) {
      res.status(400);
      throw new Error("User with such phone already exists");
    }
  }

  user.set({
    name: name,
    surname: surname,
    middlename: middlename,
    phone: newPhone,
  });

  await user.save();
  await user.reload();
  if (user) {
    res.status(201).json({
      uuid: user.uuid,
      email: user.email,
      membership: user.membership,
      name: user.name,
      surname: user.surname,
      middlename: user.middlename,
      phone: user.phone,
      token: generateJWT(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Find user by id
// @route   GET /api/user/{uuid}
// @access  Public
const findByUuid = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.uuid, {
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: [
      { model: Role, attributes: ["role"], through: { attributes: [] } },
    ],
  });
  if (user) {
    res.status(200).json({
      uuid: user.uuid,
      email: user.email,
      membership: user.membership,
      name: user.name,
      surname: user.surname,
      middlename: user.middlename,
      phone: user.phone,
      roles: user.roles.map((x) => x.role),
    });
  } else {
    res.status(400);
    throw new Error("User do not exist");
  }
});

// @desc    Find users by membership, supports pagination
// @route   GET /api/user/q?query=&role=&neqRole=&limit=&offset=
// @access  Public
const findByMembershipAndRole = asyncHandler(async (req, res) => {
  const { query, role, limit, offset } = req.query;
  if (!query || !role) {
    res.status(400);
    throw new Error("Missing the query");
  }

  const users = await User.findAll({
    attributes: { exclude: ["password", "createdAt"] },
    include: [
      {
        model: Role,
        attributes: ["role"],
        through: { attributes: [] },
        where: { role: role },
      },
    ],
    where: { membership: { [Op.substring]: query } },
    order: [["updatedAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(users);
});

// @desc    Find all users by role, supports pagination
// @route   GET /api/user/member?query=&limit=&offset=
// @access  Public
const findByMembership = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  if (!query) {
    res.status(400);
    throw new Error("Missing the query");
  }

  const users = await User.findAll({
    attributes: { exclude: ["password", "createdAt"] },
    include: [
      {
        model: Role,
        attributes: ["role"],
        through: { attributes: [] },
      },
    ],
    where: { membership: { [Op.substring]: query } },
    order: [["updatedAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(users);
});

// Auxiliary function
// Token generator: Creates JWT
const generateJWT = (uuid) => {
  return jwt.sign({ uuid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateMembership = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

module.exports = {
  createUser,
  loginUser,
  getAuthUser,
  getAuthFullData,
  getAuthRoles,
  verifyUser,
  setAdmin,
  delAdmin,
  setSuperAdmin,
  deleteMe,
  deleteUser,
  updateMe,
  updateUser,
  findByUuid,
  findByMembershipAndRole,
  findByMembership,
};
