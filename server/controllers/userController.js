const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// @desc Create new user
// @route POST /api/user/register
// @access Public
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
    const role = await Role.findOrCreate({ where: { role: "Unverified" } });
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

// @desc Login user
// @route POST /api/user/login
// @access Public
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

// @desc Verify the user
// @route POST /api/user/verify/{uuid}
// @access Private
const verifyUser = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("Worker")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const newrole = await Role.findOrCreate({ where: { role: "Verified" } });
  await user.addRole(newrole[0]);

  res.status(204).json();
});

// @desc Set worker rights
// @route POST /api/user/worker/{uuid}
// @access Private
const setWorker = asyncHandler(async (req, res) => {
  if (!req.user.roles.includes("Admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  let user = await User.findByPk(req.params.uuid);
  // Check the user exists
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  const newrole = await Role.findOrCreate({ where: { role: "Worker" } });
  await user.addRole(newrole[0]);

  res.status(204).json();
});

// @desc Check auth user
// @route GET /api/user/authuser
// @access Private
const getAuthUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
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
  setWorker,
  verifyUser,
};
