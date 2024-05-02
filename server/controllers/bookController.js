const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");
const { Op } = require("sequelize");

// @desc    Get latest books
// @route   GET /api/book/one/{uuid}
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
      },
      {
        model: Publisher,
        attributes: { exclude: ["createdAt"] },
      },
      {
        model: Section,
        attributes: { exclude: ["createdAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
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
      {
        model: Publisher,
        attributes: ["uuid", "publisher"],
      },
    ],
    attributes: [
      "uuid",
      "title",
      "originalTitle",
      "yearPublish",
      "yearAuthor",
      "number",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
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
        model: Author,
        attributes: ["uuid", "name", "surname", "middlename"],
        through: { attributes: [] },
        required: false,
      },
      {
        model: Genre,
        attributes: ["uuid", "genre"],
        through: { attributes: [] },
        required: false,
      },
      { model: Publisher, attributes: ["uuid", "publisher"], required: false },
    ],
    attributes: [
      "uuid",
      "title",
      "originalTitle",
      "yearPublish",
      "yearAuthor",
      "number",
      "createdAt",
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

    // Only one thing that can fix $nested.column$ BUG in Sequelize with limit, but than gives wrong number of objs
    subQuery: true,
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
          where: {
            genre: genre.genre,
          },
        })
      );
    }
  }

  const authorsArr = [];
  if (authors) {
    for (author of authors) {
      authorsArr.push(
        await Author.findOrCreate({
          where: {
            name: author.name,
            surname: author.surname ? author.surname : null,
            middlename: author.middlename ? author.middlename : null,
          },
        })
      );
    }
  }

  const isbnsArr = [];
  if (isbns) {
    for (isbn of isbns) {
      isbnsArr.push(
        await Isbn.findOrCreate({
          where: {
            isbn: isbn.isbn,
          },
        })
      );
    }
  }

  let publisherFOC;
  if (publisher) {
    publisherFOC = await Publisher.findOrCreate({
      where: {
        publisher: publisher.publisher,
      },
    });
  }

  let sectionFOC;
  if (section) {
    sectionFOC = await Section.findOrCreate({
      where: {
        section: section.section,
      },
    });
  }

  if (genresArr.length > 0) await book.addGenres(genresArr.map((x) => x[0]));
  if (authorsArr.length > 0) await book.addAuthors(authorsArr.map((x) => x[0]));
  if (isbnsArr.length > 0) await book.addIsbns(isbnsArr.map((x) => x[0]));
  if (publisherFOC) await publisherFOC[0].addBook(book);
  if (sectionFOC) await sectionFOC[0].addBook(book);

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
