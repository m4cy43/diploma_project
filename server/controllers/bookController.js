const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");
const { Op } = require("sequelize");

// @desc    Get latest books
// @route   GET /api/book/{uuid}
// @access  Public
const getBookByUuid = asyncHandler(async (req, res) => {
  if (!req.params.uuid) {
    res.status(400);
    throw new Error("Wrong query");
  }
  const book = await Book.findByPk(req.params.uuid, {
    include: [
      {
        model: Genre,
        attributes: { exclude: ["createdAt"] },
        through: { attributes: [] },
      },
      {
        model: Author,
        attributes: { exclude: ["createdAt"] },
        through: { attributes: [] },
      },
      {
        model: Isbn,
        attributes: { exclude: ["createdAt"] },
        through: { attributes: [] },
      },
      { model: Publisher, attributes: { exclude: ["createdAt"] } },
      { model: Section, attributes: { exclude: ["createdAt"] } },
    ],
    attributes: { exclude: ["createdAt"] },
  });
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(400);
    throw new Error("Book do not exist");
  }
});

// @desc    Get latest books
// @route   GET /api/book/latest?limit=&offset=
// @access  Public
const getLatest = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const books = await Book.findAll({
    include: [
      {
        model: Genre,
        attributes: ["uuid", "genre"],
        through: { attributes: [] },
      },
      {
        model: Author,
        attributes: ["uuid", "name", "surname", "middlename"],
        through: { attributes: [] },
      },
      { model: Publisher, attributes: ["uuid", "publisher"] },
    ],
    attributes: [
      "uuid",
      "title",
      "originalTitle",
      "yearPublish",
      "yearAuthor",
      "number",
    ],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(books);
});

// @desc    Get books by simple (flex) search
// @route   GET /api/book/flex?query=&limit=&offset=
// @access  Public
const getFlex = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  if (!query) {
    res.status(400);
    throw new Error("Missing query");
  }
  const books = await Book.findAll({
    include: [
      {
        model: Genre,
        attributes: ["uuid", "genre"],
        through: { attributes: [] },
      },
      {
        model: Author,
        attributes: ["uuid", "name", "surname", "middlename"],
        through: { attributes: [] },
      },
      { model: Publisher, attributes: ["uuid", "publisher"] },
    ],
    attributes: [
      "uuid",
      "title",
      "originalTitle",
      "yearPublish",
      "yearAuthor",
      "number",
    ],
    where: {
      [Op.or]: [
        { title: { [Op.substring]: query } },
        { originalTitle: { [Op.substring]: query } },
        { annotation: { [Op.substring]: query } },
        { "$authors.name$": { [Op.substring]: query } },
        { "$authors.surname$": { [Op.substring]: query } },
      ],
    },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(books);
});

// @desc    Create the book
// @route   GET /api/book/create
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    originalTitle,
    yearPublish,
    yearAuthor,
    bibliography,
    annotation,
    physicalDescription,
    note,
    udk,
    bbk,
    number,
    genres,
    authors,
    section,
    publisher,
    isbns,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Required values are missing");
  }
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  const book = await Book.create({
    title,
    originalTitle,
    yearPublish,
    yearAuthor,
    bibliography,
    annotation,
    physicalDescription,
    note,
    udk,
    bbk,
    number,
  });

  const genresArr = [];
  if (genres) {
    for (genre of genres) {
      genresArr.push(
        await Genre.findOrCreate({
          genre: genre.genre,
        })[0]
      );
    }
  }

  const authorsArr = [];
  if (authors) {
    for (author of authors) {
      authorsArr.push(
        await Author.findOrCreate({
          name: author.name,
          surname: authors.surname,
          middlename: authors.middlename,
        })[0]
      );
    }
  }

  const isbnsArr = [];
  if (isbns) {
    for (isbn of isbns) {
      isbnsArr.push(
        await Isbn.findOrCreate({
          isbn: isbn.isbn,
        })[0]
      );
    }
  }

  let publisherFOC;
  if (publisher) {
    publisherFOC = await Publisher.findOrCreate({
      publisher: publisher.publisher,
    })[0];
  }

  let sectionFOC;
  if (section) {
    sectionFOC = await Section.findOrCreate({
      section: section.section,
    })[0];
  }

  await book.addGenres(genresArr);
  await book.addAuthors(authorsArr);
  await book.addIsbns(isbnsArr);
  await book.addPublisher(publisherFOC);
  await book.addSection(sectionFOC);

  if (book) {
    res.status(201).json({ uuid: book.uuid });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

module.exports = {
  getBookByUuid,
  getLatest,
  getFlex,
  createBook,
};
