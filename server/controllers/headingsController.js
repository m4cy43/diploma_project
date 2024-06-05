const asyncHandler = require("express-async-handler");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");
const { Op } = require("sequelize");

// @desc    Get all genres
// @route   GET /api/headings/genre?query=&limit=&offset=
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  const genres = await Genre.findAll({
    where: { genre: { [Op.substring]: query } },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(genres);
});

// @desc    Get all authors
// @route   GET /api/headings/author?query=&limit=&offset=
// @access  Public
const getAuthors = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  const authors = await Author.findAll({
    where: { name: { [Op.substring]: query } },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(authors);
});

// @desc    Get all sections
// @route   GET /api/headings/section?query=&limit=&offset=
// @access  Public
const getSections = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  const sections = await Section.findAll({
    where: { section: { [Op.substring]: query } },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(sections);
});

// @desc    Get all publisher
// @route   GET /api/headings/publisher?query=&limit=&offset=
// @access  Public
const getPublishers = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  const publishers = await Publisher.findAll({
    where: { publisher: { [Op.substring]: query } },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(publishers);
});

// @desc    Get all isbn
// @route   GET /api/headings/isbn?query=&limit=&offset=
// @access  Public
const getIsbn = asyncHandler(async (req, res) => {
  const { query, limit, offset } = req.query;
  const isbns = await Isbn.findAll({
    where: { isbn: { [Op.substring]: query } },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(isbns);
});

// @desc    Create the genre
// @route   POST /api/headings/genre
// @access  Private
const createGenre = asyncHandler(async (req, res) => {
  // Check the content exists
  if (!req.body.genre) {
    res.status(400);
    throw new Error("Content required");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Create the genre
  const [genre, flag] = await Genre.findOrCreate({
    where: {
      genre: req.body.genre,
    },
  });
  if (flag) {
    res.status(201).json(genre);
  } else {
    res.status(400);
    throw new Error("This genre already exist");
  }
});

// @desc    Create the author
// @route   POST /api/headings/author
// @access  Private
const createAuthor = asyncHandler(async (req, res) => {
  // Check the content exists
  if (!req.body.name) {
    res.status(400);
    throw new Error("Content required");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Create the genre
  const [author, flag] = await Author.findOrCreate({
    where: {
      name: req.body.name,
      surname: req.body.surname,
      middlename: req.body.middlename,
    },
  });
  if (flag) {
    res.status(201).json(author);
  } else {
    res.status(400);
    throw new Error("This author already exist");
  }
});

// @desc    Create the section
// @route   POST /api/headings/section
// @access  Private
const createSection = asyncHandler(async (req, res) => {
  // Check the content exists
  if (!req.body.section) {
    res.status(400);
    throw new Error("Content required");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Create the genre
  const [section, flag] = await Section.findOrCreate({
    where: {
      section: req.body.section,
    },
  });
  if (flag) {
    res.status(201).json(section);
  } else {
    res.status(400);
    throw new Error("This section already exist");
  }
});

// @desc    Create the publisher
// @route   POST /api/headings/publisher
// @access  Private
const createPublisher = asyncHandler(async (req, res) => {
  // Check the content exists
  if (!req.body.publisher) {
    res.status(400);
    throw new Error("Content required");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Create the genre
  const [publisher, flag] = await Publisher.findOrCreate({
    where: {
      publisher: req.body.publisher,
    },
  });
  if (flag) {
    res.status(201).json(publisher);
  } else {
    res.status(400);
    throw new Error("This publisher already exist");
  }
});

// @desc    Create the isbn
// @route   POST /api/headings/isbn
// @access  Private
const createIsbn = asyncHandler(async (req, res) => {
  // Check the content exists
  if (!req.body.isbn) {
    res.status(400);
    throw new Error("Content required");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Create the genre
  const [isbn, flag] = await Isbn.findOrCreate({
    where: {
      isbn: req.body.isbn,
    },
  });
  if (flag) {
    res.status(201).json(isbn);
  } else {
    res.status(400);
    throw new Error("This isbn already exist");
  }
});

// @desc    Delete the genre
// @route   DELETE /api/headings/genre/{uuid}
// @access  Private
const deleteGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findByPk(req.params.uuid);

  // Check if exists
  if (!genre) {
    throw new Error("There is no such heading");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  await genre.destroy();
  res.status(204).json();
});

// @desc    Delete the author
// @route   DELETE /api/headings/author/{uuid}
// @access  Private
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByPk(req.params.uuid);

  // Check if exists
  if (!author) {
    throw new Error("There is no such heading");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  await author.destroy();
  res.status(204).json();
});

// @desc    Delete the section
// @route   DELETE /api/headings/section/{uuid}
// @access  Private
const deleteSection = asyncHandler(async (req, res) => {
  const section = await Section.findByPk(req.params.uuid);

  // Check if exists
  if (!section) {
    throw new Error("There is no such heading");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  await section.destroy();
  res.status(204).json();
});

// @desc    Delete the publisher
// @route   DELETE /api/headings/publisher/{uuid}
// @access  Private
const deletePublisher = asyncHandler(async (req, res) => {
  const publisher = await Publisher.findByPk(req.params.uuid);

  // Check if exists
  if (!publisher) {
    throw new Error("There is no such heading");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  // Delete genre
  await publisher.destroy();
  res.status(204).json();
});

// @desc    Delete the isbn
// @route   DELETE /api/headings/genre/{uuid}
// @access  Private
const deleteIsbn = asyncHandler(async (req, res) => {
  const isbn = await Isbn.findByPk(req.params.uuid);

  // Check if exists
  if (!isbn) {
    throw new Error("There is no such heading");
  }

  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }

  await isbn.destroy();
  res.status(204).json();
});

module.exports = {
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
};
