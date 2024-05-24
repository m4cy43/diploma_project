const express = require("express");
const router = express.Router();
const {
  getAllDebts,
  getUserDebts,
  isDebted,
  createDebt,
  reservationToDebt,
  deleteDebt,
} = require("../controllers/debtController");

// Auth middleware
// Routes protection
const { authorization } = require("../middleware/authMiddleware");

// GET /api/debt/allall?query=&limit=&offset=
router.get("/all", authorization, getAllDebts);
// GET /api/debt/auth
router.get("/auth", authorization, getUserDebts);
// GET /api/debt/auth
router.get("/is/:uuid", authorization, isDebted);
// POST /api/debt
router.post("/", authorization, createDebt);
// PUT /api/debt/restodebt
router.put("/restodebt", authorization, reservationToDebt);
// POST /api/debt/{uuid}
router.delete("/:uuid", authorization, deleteDebt);

module.exports = router;
