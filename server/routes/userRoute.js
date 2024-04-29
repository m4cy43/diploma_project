const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAuthUser,
  setWorker,
  verifyUser,
} = require("../controllers/userController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// POST /api/user/register
router.post("/register", createUser);
// POST /api/user/login
router.post("/login", loginUser);
// PUT /api/user/setworker
router.put("/worker/:uuid", authorization, setWorker);
// PUT /api/user/setworker
router.put("/verify/:uuid", authorization, verifyUser);

// GET /api/user/authuser
router.get("/authuser", authorization, getAuthUser);

module.exports = router;
