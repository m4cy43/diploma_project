const express = require("express");
const router = express.Router();
const {
  getBookByUuid,
  getLatest,
  getFlex,
  getAdvanced,
  createBook,
} = require("../controllers/bookController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/book/one/{uuid}
router.get("/one/:uuid", getBookByUuid);
// GET /api/book/latest?limit=&offset=
router.get("/latest", getLatest);
// GET /api/book/flex?query=&limit=&offset=
router.get("/flex", getFlex);

router.get("/advanced", getAdvanced);
// GET /api/book/create
router.post("/create", authorization, createBook);

module.exports = router;
