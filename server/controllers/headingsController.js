const asyncHandler = require("express-async-handler");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");

// @desc    Get all genres
// @route   GET /api/headings/genre?limit=&offset=
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const genres = await Genre.findAll({
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(genres);
});

// @desc    Get all authors
// @route   GET /api/headings/author?limit=&offset=
// @access  Public
const getAuthors = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const authors = await Author.findAll({
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(authors);
});

// @desc    Get all sections
// @route   GET /api/headings/section?limit=&offset=
// @access  Public
const getSections = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const sections = await Section.findAll({
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(sections);
});

// @desc    Get all publisher
// @route   GET /api/headings/publisher?limit=&offset=
// @access  Public
const getPublishers = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const publishers = await Publisher.findAll({
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
  });
  res.status(200).json(publishers);
});

// @desc    Get all isbn
// @route   GET /api/headings/isbn?limit=&offset=
// @access  Public
const getIsbn = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const isbns = await Isbn.findAll({
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: false,
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
  const genre = await Genre.create({
    genre: req.body.genre,
  });
  if (genre) {
    res.status(201).json(genre);
  } else {
    res.status(400);
    throw new Error("Could not add the heading");
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
  const author = await Author.create({
    name: req.body.name,
    surname: req.body.surname,
    middlename: req.body.middlename,
  });
  if (author) {
    res.status(201).json(author);
  } else {
    res.status(400);
    throw new Error("Could not add the heading");
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
  const section = await Section.create({
    section: req.body.section,
  });
  if (section) {
    res.status(201).json(section);
  } else {
    res.status(400);
    throw new Error("Could not add the heading");
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
  const publisher = await Publisher.create({
    publisher: req.body.publisher,
  });
  if (publisher) {
    res.status(201).json(publisher);
  } else {
    res.status(400);
    throw new Error("Could not add the heading");
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
  const isbn = await Isbn.create({
    isbn: req.body.isbn,
  });
  if (isbn) {
    res.status(201).json(isbn);
  } else {
    res.status(400);
    throw new Error("Could not add the heading");
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
