const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Userbook = require("../models/userBookModel");
const Book = require("../models/bookModel");
const { Op } = require("sequelize");

// @desc    Get user debts
// @route   GET /api/bookmark/auth
// @access  Private
const getUserBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await User.findAll({
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
        attributes: ["uuid", "type", "note", "updatedAt"],
        where: { type: "bookmark" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "updatedAt", "DESC"]],
  });
  res.status(200).json(bookmarks);
});

// @desc    Check if user add the bookmark to the book
// @route   GET /api/bookmark/is/{uuid}
// @access  Private
const isBookmarked = asyncHandler(async (req, res) => {
  const bookmarks = await User.findAll({
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
        attributes: ["uuid", "type", "note", "updatedAt"],
        where: { type: "bookmark" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "updatedAt", "DESC"]],
  });
  res.status(200).json(bookmarks);
});

// @desc    Create new debt
// @route   POST /api/bookmark?uuid=&note=
// @access  Public
const createBookmark = asyncHandler(async (req, res) => {
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

  let bookmark = await Userbook.findOne({
    where: {
      [Op.and]: [{ userUuid: user.uuid }, { bookUuid: book.uuid }],
    },
  });
  bookmark.type = "bookmark";
  bookmark.note = req.query.note;
  await bookmark.save();
  res.status(204).json();
});

// @desc    Create new debt
// @route   DELETE /api/bookmark/{uuid}
// @access  Public
const deleteBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Userbook.findByPk(req.params.uuid);
  if (!bookmark) {
    res.status(400);
    throw new Error("There is no such bookmark");
  }

  await bookmark.destroy();
  res.status(204).json();
});

module.exports = {
  getUserBookmarks,
  isBookmarked,
  createBookmark,
  deleteBookmark,
};
