const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");
const { Op } = require("sequelize");
const {
  returnOrderedSimilarities,
} = require("../calculations/sentenceEncoding");

// @desc    Get book by uuid
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
// @route   GET /api/book/latest?limit=&offset=&sort=
// @access  Public
const getLatest = asyncHandler(async (req, res) => {
  const { limit, offset, sort } = req.query;

  let sortBy = sortParams[sort];
  if (!sortBy) {
    sortBy = sortParams.createdAtDESC;
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
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(books);
});

// @desc    Get books by simple (flex) search + logic
// @route   GET /api/book/flex?query=&limit=&offset=&sort=&logic=
// @access  Public
const getFlex = asyncHandler(async (req, res) => {
  const { query, limit, offset, sort, logic } = req.query;
  let newquery = query;
  if (!query) {
    // res.status(400);
    // throw new Error("Missing query");
    newquery = "_";
  }

  let sortBy = sortParams[sort];
  if (!sortBy) {
    sortBy = sortParams.createdAtDESC;
  }

  // Replace "AND, OR, (), *" and convert the string to regex
  if (logic) {
    let arr = query.split(/(\s|\(|\)|AND|OR)/g);
    arr = arr.filter((x) => x !== "" && x !== " ");
    arr = arr.map((x) => {
      if (x.includes("*")) {
        x = x.replace("*", "(.*?)");
      }
      if (!(x === "(" || x === ")" || x === "AND" || x === "OR")) {
        x = "(?=(.*?)" + x + "(.*?))";
      }
      if (x === "AND") {
        x = "";
      }
      if (x === "OR") {
        x = "|";
      }
      return x;
    });
    newquery = arr.join("");
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
        { title: { [Op.regexp]: newquery } },
        { originalTitle: { [Op.regexp]: newquery } },
        { annotation: { [Op.regexp]: newquery } },
        { bibliography: { [Op.regexp]: newquery } },
      ],
    },
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(books);
});

// @desc    Get books by one and more (different) fields
// @route   GET /api/book/advanced?limit=&offset=&sort=
// @access  Public
const getAdvanced = asyncHandler(async (req, res) => {
  const { limit, offset, sort } = req.query;
  const {
    title,
    original,
    authorname,
    authorsurname,
    genres,
    section,
    publisher,
    yearStart,
    yearEnd,
    isbn,
    udk,
    bbk,
  } = req.body;

  let sortBy = sortParams[sort];
  if (!sortBy) {
    sortBy = sortParams.createdAtDESC;
  }

  const books = await Book.findAll({
    include: [
      {
        model: Author,
        attributes: ["uuid", "name", "surname", "middlename"],
        through: { attributes: [] },
        where: {
          name: { [Op.substring]: authorname },
          surname: { [Op.substring]: authorsurname },
        },
      },
      {
        model: Genre,
        attributes: ["uuid", "genre"],
        through: { attributes: [] },
        where: { genre: { [Op.substring]: genres } },
      },
      {
        model: Publisher,
        attributes: ["uuid", "publisher"],
        where: { publisher: { [Op.substring]: publisher } },
      },
      {
        model: Isbn,
        attributes: ["isbn"],
        where: { isbn: { [Op.substring]: isbn } },
      },
      {
        model: Section,
        attributes: ["section"],
        where: { section: { [Op.substring]: section } },
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
    where: {
      title: { [Op.substring]: title },
      originalTitle: { [Op.substring]: original },
      [Op.or]: [
        {
          yearAuthor: {
            [Op.gte]: yearStart,
            [Op.lte]: yearEnd,
          },
        },
        {
          yearPublish: {
            [Op.gte]: yearStart,
            [Op.lte]: yearEnd,
          },
        },
      ],
      udk: { [Op.substring]: udk },
      bbk: { [Op.substring]: bbk },
    },
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
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

// @desc    Update the book
// @route   UPDATE /api/book/upd
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
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

  const book = await Book.set({
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
  await book.save();

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

  if (genresArr.length > 0) await book.setGenres(genresArr.map((x) => x[0]));
  if (authorsArr.length > 0) await book.setAuthors(authorsArr.map((x) => x[0]));
  if (isbnsArr.length > 0) await book.setIsbns(isbnsArr.map((x) => x[0]));
  if (publisherFOC) await publisherFOC[0].setBooks(book);
  if (sectionFOC) await sectionFOC[0].setBooks(book);

  if (book) {
    res.status(201).json({ uuid: book.uuid });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

// @desc    Delete the book
// @route   DELETE /api/book/del/{uuid}
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.uuid);
  // Check the book exists
  if (!book) {
    res.status(400);
    throw new Error("There is no such book");
  }
  if (!req.user.roles.includes("admin")) {
    res.status(401);
    throw new Error("Action not alowed due to role");
  }
  await book.destroy();
  res.status(204).json();
});

// @desc    Get all books by author
// @route   GET /api/book/author?uuid=&limit=&offset=
// @access  Public
// const getAllAuthor = asyncHandler(async (req, res) => {});

// @desc    Get all books by genre
// @route   GET /api/book/genre?uuid=&limit=&offset=
// @access  Public
// const getAllGenre = asyncHandler(async (req, res) => {});

// @desc    Get all books by section
// @route   GET /api/book/section?uuid=&limit=&offset=
// @access  Public
// const getAllSection = asyncHandler(async (req, res) => {});

// @desc    Get all books by publisher
// @route   GET /api/book/publisher?uuid=&limit=&offset=
// @access  Public
// const getAllPublisher = asyncHandler(async (req, res) => {});

// @desc    Get similar books
// @route   GET /api/book/similar
// @access  Public
const getSimilarBooks = asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    include: [
      {
        model: Author,
        attributes: ["name", "surname", "middlename"],
        through: { attributes: [] },
      },
      {
        model: Genre,
        attributes: ["genre"],
        through: { attributes: [] },
        where: { genre: req.body.genres },
      },
    ],
    attributes: ["uuid", "title", "originalTitle", "annotation"],
    order: rateDESC,
    limit: 20,
    subQuery: true,
  });

  const subject = JSON.stringify(req.body);
  const similarities = books.map((x) => JSON.stringify(x));

  const recommendations = await returnOrderedSimilarities(
    subject,
    similarities
  );

  res.status(200).json(recommendations);
});

const sortParams = {
  createdAtDESC: [["createdAt", "DESC"]],
  createdAtASC: [["createdAt", "ASC"]],
  yearAuthorDESC: [["yearAuthor", "DESC"]],
  yearAuthorASC: [["yearAuthor", "ASC"]],
  yearPublishDESC: [["yearPublish", "DESC"]],
  yearPublishASC: [["yearPublish", "ASC"]],
  authorNameDESC: [[Author, "name", "DESC"]],
  authorNameASC: [[Author, "name", "ASC"]],
  authorSurnameDESC: [[Author, "surname", "DESC"]],
  authorSurnameASC: [[Author, "surname", "ASC"]],
  genreDESC: [[Genre, "genre", "DESC"]],
  genreASC: [[Genre, "genre", "ASC"]],
  sectionDESC: [[Section, "section", "DESC"]],
  sectionASC: [[Section, "section", "ASC"]],
  publisherDESC: [[Publisher, "publicher", "DESC"]],
  publisherASC: [[Publisher, "publicher", "ASC"]],
  rateDESC: [["rate", "DESC"]],
  rateASC: [["rate", "ASC"]],
};

module.exports = {
  getBookByUuid,
  getLatest,
  getFlex,
  getAdvanced,
  createBook,
  updateBook,
  deleteBook,
  getSimilarBooks,
};
