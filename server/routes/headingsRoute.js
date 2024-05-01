const express = require("express");
const router = express.Router();
const {
  getGenres,
  getAuthors,
  getSections,
  getPublishers,
  getIsbn,
  createGenre,
  createAuthor,
  createSection,
  createPublisher,
  createIsbn,
  deleteGenre,
  deleteAuthor,
  deleteSection,
  deletePublisher,
  deleteIsbn,
} = require("../controllers/headingsController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/headings/genre
router.get("/genre", getGenres);
// GET /api/headings/author
router.get("/author", getAuthors);
// GET /api/headings/section
router.get("/section", getSections);
// GET /api/headings/publisher
router.get("/publisher", getPublishers);
// GET /api/headings/isbn
router.get("/isbn", getIsbn);
// POST /api/headings/genre
router.post("/genre", authorization, createGenre);
// POST /api/headings/author
router.post("/author", authorization, createAuthor);
// POST /api/headings/section
router.post("/section", authorization, createSection);
// POST /api/headings/publisher
router.post("/publisher", authorization, createPublisher);
// POST /api/headings/isbn
router.post("/isbn", authorization, createIsbn);
// DELETE /api/headings/genre/{uuid}
router.delete("/genre/:uuid", authorization, deleteGenre);
// DELETE /api/headings/author/{uuid}
router.delete("/author/:uuid", authorization, deleteAuthor);
// DELETE /api/headings/section/{uuid}
router.delete("/section/:uuid", authorization, deleteSection);
// DELETE /api/headings/publisher/{uuid}
router.delete("/publisher/:uuid", authorization, deletePublisher);
// DELETE /api/headings/isbn/{uuid}
router.delete("/isbn/:uuid", authorization, deleteIsbn);

module.exports = router;
