const express = require("express");
const router = express.Router();
const {
  getBookByUuid,
  getLatest,
  getFlex,
  createBook,
} = require("../controllers/bookController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/book/{uuid}
router.get("/:uuid", getBookByUuid);
// GET /api/book/latest?limit=&offset=
router.get("/latest", getLatest);
// GET /api/book/flex?query=&limit=&offset=
router.get("/flex", getFlex);
// GET /api/book/create
router.post("/create", authorization, createBook);

module.exports = router;
