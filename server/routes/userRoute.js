const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// POST /api/user/register
router.post("/register", createUser);
// POST /api/user/login
router.post("/login", loginUser);
// PUT /api/user/setadmin/{uuid}
router.put("/setadmin/:uuid", authorization, setAdmin);
// PUT /api/user/setsuper/{uuid}
router.put("/setsuper/:uuid", authorization, setSuperAdmin);
// PUT /api/user/verify/{uuid}
router.put("/verify/:uuid", authorization, verifyUser);
// DELETE /api/user/
router.delete("/", authorization, deleteMe);
// DELETE /api/user/{uuid}
router.delete("/:uuid", deleteUser);
// PUT /api/user/
router.put("/", authorization, updateMe);
// PUT /api/user/{uuid}
router.put("/:uuid", updateUser);
// GET /api/user/{uuid}
router.get("/get/:uuid", findByUuid);
// GET /api/user/q?query=&role=
router.get("/q", findByMembershipAndRole);
// GET /api/user/role?role=
router.get("/role", findByRole);

// GET /api/user/me
router.get("/me", authorization, getAuthUser);

module.exports = router;
