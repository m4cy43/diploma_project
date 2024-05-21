const express = require("express");
const router = express.Router();
const {
  getBookByUuid,
  getLatest,
  getFlex,
  getAdvanced,
  createBook,
  updateBook,
  deleteBook,
  getAllAuthor,
  getAllGenre,
  getAllPublisher,
  getSimilarBooks,
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
// GET /api/book/advanced?limit=&offset=
router.get("/advanced", getAdvanced);
// GET /api/book/create
router.post("/create", authorization, createBook);
// GET /api/book/upd
router.put("/upd", authorization, updateBook);
// GET /api/book/del/:uuid
router.delete("/del/:uuid", authorization, deleteBook);

// GET /api/book/heading/author?uuid=&limit=&offset=&sort=
router.get("/heading/author", getAllAuthor);
// GET /api/book/heading/genre?uuid=&limit=&offset=&sort=
router.get("/heading/genre", getAllGenre);
// GET /api/book/heading/publisher?uuid=&limit=&offset=&sort=
router.get("/heading/publisher", getAllPublisher);

// GET /api/book/similar
router.get("/similar", getSimilarBooks);

module.exports = router;
