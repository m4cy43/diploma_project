const express = require("express");
const router = express.Router();
const {
  getUserBookmarks,
  isBookmarked,
  createBookmark,
  deleteBookmark,
} = require("../controllers/bookmarkController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/bookmark/auth
router.get("/auth", authorization, getUserBookmarks);
// GET /api/bookmark/is/{uuid}
router.get("/is/:uuid", authorization, isBookmarked);
// POST /api/bookmark?uuid=&note=
router.post("/", authorization, createBookmark);
// POST /api/bookmark/{uuid}
router.delete("/:uuid", authorization, deleteBookmark);

module.exports = router;
