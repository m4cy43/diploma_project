const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  getUserReservations,
  createReservation,
  deleteReservation,
} = require("../controllers/reserveController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/reserve/all?query=&limit=&offset=
router.get("/all", authorization, getAllReservations);
// GET /api/reserve/auth
router.get("/auth", authorization, getUserReservations);
// POST /api/reserve/{uuid}
router.post("/:uuid", authorization, createReservation);
// POST /api/reserve/{uuid}
router.delete("/:uuid", authorization, deleteReservation);

module.exports = router;
