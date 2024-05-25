const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Userbook = require("../models/userBookModel");
const Book = require("../models/bookModel");
const { Op } = require("sequelize");

// @desc    Get all reservations
// @route   GET /api/reserve/all?query=&limit=&offset=
// @access  Public
const getAllReservations = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }
  const reserv = await User.findAll({
    include: {
      model: Book,
      required: true,
      attributes: [
        "uuid",
        "title",
        "originalTitle",
        "yearPublish",
        "yearAuthor",
      ],
      through: {
        attributes: ["uuid", "type", "deadline", "note", "updatedAt"],
        where: { type: "reservation" },
      },
    },
    attributes: ["uuid", "email", "name", "surname", "phone", "membership"],
    where: {
      membership: { [Op.substring]: query ? query : "_" },
    },
    order: [[Book, Userbook, "deadline", "ASC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(reserv);
});

// @desc    Get user reservations
// @route   GET /api/reserve/auth
// @access  Public
const getUserReservations = asyncHandler(async (req, res) => {
  const reserv = await User.findAll({
    include: {
      model: Book,
      required: true,
      attributes: [
        "uuid",
        "title",
        "originalTitle",
        "yearPublish",
        "yearAuthor",
      ],
      through: {
        attributes: ["uuid", "type", "deadline", "note", "updatedAt"],
        where: { type: "reservation" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "deadline", "ASC"]],
  });
  res.status(200).json(reserv);
});

// @desc    Check if user reserved the book
// @route   GET /api/reserve/is/{uuid}
// @access  Public
const isReserved = asyncHandler(async (req, res) => {
  const reserv = await User.findAll({
    include: {
      model: Book,
      where: { uuid: req.params.uuid },
      required: true,
      attributes: [
        "uuid",
        "title",
        "originalTitle",
        "yearPublish",
        "yearAuthor",
      ],
      through: {
        attributes: ["uuid", "type", "deadline", "note", "updatedAt"],
        where: { type: "reservation" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "updatedAt", "DESC"]],
  });
  res.status(200).json(reserv);
});

// @desc    Create new reservation
// @route   POST /api/reserve?uuid=&note=
// @access  Public
const createReservation = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.uuid);
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const book = await Book.findByPk(req.query.uuid);
  if (!book) {
    res.status(400);
    throw new Error("There is no such book");
  }

  await user.addBook(book);

  let reserv = await Userbook.findOne({
    where: {
      [Op.and]: [{ userUuid: user.uuid }, { bookUuid: book.uuid }],
    },
  });
  reserv.type = "reservation";
  reserv.note = req.query.note;

  let datetochange = new Date();
  let newDate = datetochange.getDate() + 14;
  datetochange.setDate(newDate);
  datetochange = datetochange.toISOString();
  reserv.deadline = datetochange.split("T")[0];

  await reserv.save();
  res.status(204).json();
});

// @desc    Delete the reservation
// @route   DELETE /api/reserve/{uuid}
// @access  Public
const deleteReservation = asyncHandler(async (req, res) => {
  const reserv = await Userbook.findByPk(req.params.uuid);
  if (!reserv) {
    res.status(400);
    throw new Error("There is no such reservation");
  }

  await reserv.destroy();
  res.status(204).json();
});

// @desc    Delete expired reservations
// @route   DELETE /api/reserve/{uuid}
// @access  Public
const deleteOld = asyncHandler(async (req, res) => {
  // TODO
});

module.exports = {
  getAllReservations,
  getUserReservations,
  isReserved,
  createReservation,
  deleteReservation,
};
