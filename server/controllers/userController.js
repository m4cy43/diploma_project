const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
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

  // Check if user exists by email
  const checkIfUserExists = await User.findOne({ where: { email } });
  if (checkIfUserExists) {
    res.status(400);
    throw new Error("The user already exists");
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
    phone: phone,
  });
  if (user) {
    // Add role to user
    const role = await Role.findOrCreate({ where: { role: "unverified" } });
    await user.addRole(role[0]);

    res.status(201).json({
      uuid: user.uuid,
      email: user.email,
      membership: user.membership,
      name: user.name,
      surname: user.surname,
      middlename: user.middlename,
      phone: user.phone,
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
      uuid: user.uuid,
      email: user.email,
      membership: user.membership,
      name: user.name,
      surname: user.surname,
      middlename: user.middlename,
      phone: user.phone,
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

  res.status(204).json();
});

// @desc    Set admin rights
// @route   PUT /api/user/setadmin/{uuid}
// @access  Private
const setAdmin = asyncHandler(async (req, res) => {
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

  const newrole = await Role.findOrCreate({ where: { role: "admin" } });
  await user.addRole(newrole[0]);

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

  await user.destroy();
  res.status(204).json();
});

// @desc    Delete the user
// @route   DELETE /api/user/{uuid}
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  await user.destroy();
  res.status(204).json();
});

// @desc    Update auth user
// @route   PUT /api/user/
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { email, password, name, surname, middlename, phone } = req.body;
  // Check the value
  if (!email || !password) {
    res.status(400);
    throw new Error("Required values are missing");
  }

  // Check the user exists
  let user = await User.findByPk(req.user.uuid);
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  // Check if user exists by email
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists && user.email !== email) {
    res.status(400);
    throw new Error("User with such email already exists");
  }
  // Check if phone exists
  if (phone) {
    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists && user.phone !== phone) {
      res.status(400);
      throw new Error("User with such phone already exists");
    }
  }

  // Encryption & hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.toString(), salt);

  // Remove verified role if name/surnam/middlename is changed
  if (
    (name && user.name !== name) ||
    (surname && user.surname !== surname) ||
    (middlename && user.middlename !== middlename)
  ) {
    const roleToDel = await Role.findOne({ where: { role: "verified" } });
    await user.removeRole(roleToDel);
  }

  user.set({
    email: email,
    password: hash,
    // membership: membership,
    name: name,
    surname: surname,
    middlename: middlename,
    phone: phone,
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

// @desc    Update the user
// @route   PUT /api/user/{uuid}
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const { email, password, name, surname, middlename, phone } = req.body;
  // Check the value
  if (!email || !password) {
    res.status(400);
    throw new Error("Required values are missing");
  }

  // Check the user exists
  let user = await User.findByPk(req.params.uuid);
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  // Check if user exists by email
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists && user.email !== email) {
    res.status(400);
    throw new Error("User with such email already exists");
  }
  // Check if phone exists
  if (phone) {
    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists && user.phone !== phone) {
      res.status(400);
      throw new Error("User with such phone already exists");
    }
  }

  // Encryption & hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.toString(), salt);

  user.set({
    email: email,
    password: hash,
    // membership: membership,
    name: name,
    surname: surname,
    middlename: middlename,
    phone: phone,
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
// @route   GET /api/user/q?query=&role=&limit=&offset=
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
      { model: Role, through: { attributes: [] }, where: { role: role } },
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
// @route   GET /api/user/role?role=&limit=&offset=
// @access  Public
const findByRole = asyncHandler(async (req, res) => {
  const { role, limit, offset } = req.query;
  if (!role) {
    res.status(400);
    throw new Error("Missing the query");
  }

  const users = await User.findAll({
    attributes: { exclude: ["password", "createdAt"] },
    include: [
      { model: Role, through: { attributes: [] }, where: { role: role } },
    ],
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
  verifyUser,
  setAdmin,
  setSuperAdmin,
  deleteMe,
  deleteUser,
  updateMe,
  updateUser,
  findByUuid,
  findByMembershipAndRole,
  findByRole,
};
