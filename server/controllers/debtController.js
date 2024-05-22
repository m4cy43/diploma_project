const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Userbook = require("../models/userBookModel");
const Book = require("../models/bookModel");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

// @desc    Get all debts
// @route   GET /api/debt/all?query=&limit=&offset=
// @access  Private
const getAllDebts = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }
  const debts = await User.findAll({
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
        where: { type: "debt" },
      },
    },
    attributes: ["uuid", "email", "name", "surname", "phone", "membership"],
    where: {
      membership: { [Op.substring]: query },
    },
    order: [[Book, Userbook, "updatedAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(debts);
});

// @desc    Get user debts
// @route   GET /api/debt/auth
// @access  Public
const getUserDebts = asyncHandler(async (req, res) => {
  const debts = await User.findAll({
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
        where: { type: "debt" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "updatedAt", "DESC"]],
  });
  res.status(200).json(debts);
});

// @desc    Check if user debt the book
// @route   GET /api/debt/is/{uuid}
// @access  Public
const isDebted = asyncHandler(async (req, res) => {
  const debts = await User.findAll({
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
        where: { type: "debt" },
      },
    },
    where: { uuid: req.user.uuid },
    attributes: ["uuid", "email", "membership"],
    order: [[Book, Userbook, "updatedAt", "DESC"]],
  });
  res.status(200).json(debts);
});

// @desc    Create new debt
// @route   POST /api/debt
// @access  Private
const createDebt = asyncHandler(async (req, res) => {
  const { userUuid, bookUuid, deadline, note } = req.body;
  if (!userUuid || !bookUuid) {
    res.status(400);
    throw new Error("Missing required data");
  }
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const user = await User.findByPk(userUuid);
  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }
  const book = await Book.findByPk(bookUuid);
  if (!book) {
    res.status(400);
    throw new Error("There is no such book");
  }

  await user.addBook(book);

  book.number--;
  book.debtedNumber++;
  await book.save();

  let debt = await Userbook.findOne({
    where: {
      [Op.and]: [{ userUuid: user.uuid }, { bookUuid: book.uuid }],
    },
  });
  debt.type = "debt";
  debt.note = note;

  let datetochange = new Date();
  datetochange.setDate(datetochange.getDate() + deadline);
  datetochange = datetochange.toISOString();
  debt.deadline = datetochange.split("T")[0];

  await debt.save();
  res.status(204).json();
});

// @desc    Create new debt from reservation
// @route   PUT /api/debt/restodebt/
// @access  Private
const reservationToDebt = asyncHandler(async (req, res) => {
  const { uuid, deadline, note } = req.body;
  if (!uuid) {
    res.status(400);
    throw new Error("Missing required data");
  }
  const debt = await Userbook.findByPk(uuid);
  if (!debt) {
    res.status(400);
    throw new Error("There is no such debt");
  }
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const book = await Book.findByPk(debt.bookUuid);
  if (!book) {
    res.status(400);
    throw new Error("There is no such book");
  }
  book.number--;
  book.debtedNumber++;
  await book.save();

  debt.type = "debt";
  debt.note = note;

  let datetochange = new Date();
  datetochange.setDate(datetochange.getDate() + deadline);
  datetochange = datetochange.toISOString();
  debt.deadline = datetochange.split("T")[0];

  await debt.save();
  res.status(204).json();
});

// @desc    Delete the debt
// @route   DELETE /api/debt/{uuid}
// @access  Private
const deleteDebt = asyncHandler(async (req, res) => {
  const debt = await Userbook.findByPk(req.params.uuid);
  if (!debt) {
    res.status(400);
    throw new Error("There is no such debt");
  }
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const book = await Book.findByPk(debt.bookUuid);
  book.number++;
  book.debtedNumber--;
  await book.save();

  await debt.destroy();
  res.status(204).json();
});

// @desc    Send email for notification
// @route   POST /api/debt/mail/{uuid}
// @access  Private
const sendEmail = asyncHandler(async (req, res) => {
  // Check if auth user has admin rights
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const user = User.findByPk(req.params.uuid, {
    include: {
      model: Book,
      attributes: ["uuid", "title"],
      through: {
        attributes: ["uuid", "type", "deadline", "updatedAt"],
        where: { type: "debt" },
      },
    },
  });

  if (!user) {
    res.status(400);
    throw new Error("There is no such user");
  }

  if (!user.books) {
    res.status(418);
    throw new Error("User have no debts :/");
  }

  const debts = user.books.filter(
    (book) => Date.now() - Date.parse(book.userbook.deadline) > 0
  );

  let message = "Шановний читачу! Нагадуємо вам про заборгованості:\n";
  debts.map(
    (book) =>
      (message += `Книга: ${book.title} - Дедлайн: ${book.userbook.deadline}\n`)
  );

  const [mail, pass, host] = [
    process.env.MAIL_USER,
    process.env.MAIL_PASS,
    process.env.MAIL_SERVICE,
  ];

  let transporter = nodemailer.createTransport({
    service: host,
    auth: {
      user: mail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: user_mail,
    to: user,
    subject: "Нагадування про борг",
    text: message,
  };

  let info = await transporter.sendMail(mailOptions);
  res.status(200).json(info);
});

module.exports = {
  getAllDebts,
  getUserDebts,
  isDebted,
  createDebt,
  reservationToDebt,
  deleteDebt,
  sendEmail,
};
