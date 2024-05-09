const express = require("express");
const router = express.Router();
const {
  getUserBookmarks,
  createBookmark,
  deleteBookmark,
} = require("../controllers/bookmarkController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/bookmark/auth
router.get("/auth", authorization, getUserBookmarks);
// POST /api/bookmark/{uuid}
router.post("/:uuid", authorization, createBookmark);
// POST /api/bookmark/{uuid}
router.delete("/:uuid", authorization, deleteBookmark);

module.exports = router;
