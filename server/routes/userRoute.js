const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAuthUser,
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
// DELETE /api/user/deladmin/{uuid}
router.put("/deladmin/:uuid", authorization, delAdmin);
// PUT /api/user/setsuper/{uuid}
router.put("/setsuper/:uuid", authorization, setSuperAdmin);
// PUT /api/user/verify/{uuid}
router.put("/verify/:uuid", authorization, verifyUser);
// DELETE /api/user/
router.delete("/", authorization, deleteMe);
// DELETE /api/user/{uuid}
router.delete("/:uuid", authorization, deleteUser);
// PUT /api/user/
router.put("/", authorization, updateMe);
// PUT /api/user/{uuid}
router.put("/:uuid", authorization, updateUser);
// GET /api/user/{uuid}
router.get("/get/:uuid", findByUuid);
// GET /api/user/q?query=&role=&limit=&offset=
router.get("/q", findByMembershipAndRole);
// GET /api/user/member?query=&limit=&offset=
router.get("/member", findByMembership);

// GET /api/user/me
router.get("/me", authorization, getAuthUser);
// GET /api/user/full
router.get("/full", authorization, getAuthUser);
// GET /api/user/roles
router.get("/roles", authorization, getAuthUser);

module.exports = router;
