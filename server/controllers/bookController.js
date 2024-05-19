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
      "rate",
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
      "rate",
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
  const {
    limit,
    offset,
    sort,
    title,
    authors,
    genres,
    section,
    publisher,
    yearStart,
    yearEnd,
    isbn,
    udk,
    bbk,
  } = req.query;

  let setYearStart = yearStart == "_" ? 0 : yearStart;
  let setYearEnd = yearEnd == "_" ? 3000 : yearEnd;
  let genresArr = genres.split(";").map((x) => x.trim());
  let authorsArr = authors
    .split(";")
    .map((x) => x.trim())
    .map((x) => x.split(" "))
    .map((x) => x.filter((y) => y != ""))
    .map((x) => {
      if (x.length == 0) return { name: "_", middlename: "_", surname: "_" };
      if (x.length == 1) return { name: x[0], middlename: "_", surname: "_" };
      if (x.length == 2) return { name: x[0], middlename: "_", surname: x[1] };
      if (x.length == 3) return { name: x[0], middlename: x[2], surname: x[1] };
      if (x.length > 3) return { name: x[0], middlename: "_", surname: "_" };
    });

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
          name: { [Op.substring]: authorsArr.map((x) => x.name) },
          surname: { [Op.substring]: authorsArr.map((x) => x.surname) },
          middlename: { [Op.substring]: authorsArr.map((x) => x.middlename) },
        },
      },
      {
        model: Genre,
        attributes: ["uuid", "genre"],
        through: { attributes: [] },
        where: { genre: { [Op.substring]: genresArr } },
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
      "rate",
      "createdAt",
    ],
    where: {
      [Op.or]: [
        { title: { [Op.substring]: title } },
        { originalTitle: { [Op.substring]: title } },
      ],
      [Op.or]: [
        {
          yearAuthor: {
            [Op.gte]: setYearStart,
            [Op.lte]: setYearEnd,
          },
        },
        {
          yearPublish: {
            [Op.gte]: setYearStart,
            [Op.lte]: setYearEnd,
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
// @route   GET /api/book/heading/author?uuid=&limit=&offset=&sort=
// @access  Public
const getAllAuthor = asyncHandler(async (req, res) => {
  const { uuid, limit, offset, sort } = req.query;

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
        where: {
          uuid: uuid,
        },
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
      "rate",
      "createdAt",
    ],
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(books);
});

// @desc    Get all books by genre
// @route   GET /api/book/heading/genre?uuid=&limit=&offset=&sort=
// @access  Public
const getAllGenre = asyncHandler(async (req, res) => {
  const { uuid, limit, offset, sort } = req.query;

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
        where: {
          uuid: uuid,
        },
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
      "rate",
      "createdAt",
    ],
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(books);
});

// @desc    Get all books by publisher
// @route   GET /api/book/heading/publisher?uuid=&limit=&offset=&sort=
// @access  Public
const getAllPublisher = asyncHandler(async (req, res) => {
  const { uuid, limit, offset, sort } = req.query;

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
        where: {
          uuid: uuid,
        },
      },
    ],
    attributes: [
      "uuid",
      "title",
      "originalTitle",
      "yearPublish",
      "yearAuthor",
      "number",
      "rate",
      "createdAt",
    ],
    order: sortBy,
    limit: parseInt(limit) ? parseInt(limit) : 10,
    offset: parseInt(offset) ? parseInt(offset) : 0,
    subQuery: true,
  });
  res.status(200).json(books);
});

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
  titleDESC: [["title", "DESC"]],
  titleASC: [["title", "ASC"]],
  yearDESC: [
    ["yearPublish", "DESC"],
    ["createdAt", "DESC"],
  ],
  yearASC: [
    ["yearPublish", "ASC"],
    ["createdAt", "DESC"],
  ],
  authorDESC: [
    [Author, "name", "DESC"],
    [Author, "surname", "DESC"],
    [Author, "middlename", "DESC"],
    ["createdAt", "DESC"],
  ],
  authorASC: [
    [Author, "name", "ASC"],
    [Author, "surname", "ASC"],
    [Author, "middlename", "ASC"],
    ["createdAt", "DESC"],
  ],
  genreDESC: [
    [Genre, "genre", "DESC"],
    ["createdAt", "DESC"],
  ],
  genreASC: [
    [Genre, "genre", "ASC"],
    ["createdAt", "DESC"],
  ],
  publisherDESC: [
    [Publisher, "publisher", "DESC"],
    ["createdAt", "DESC"],
  ],
  publisherASC: [
    [Publisher, "publisher", "ASC"],
    ["createdAt", "DESC"],
  ],
  rateDESC: [
    ["rate", "DESC"],
    ["createdAt", "DESC"],
  ],
  rateASC: [
    ["rate", "ASC"],
    ["createdAt", "DESC"],
  ],
};

module.exports = {
  getBookByUuid,
  getLatest,
  getFlex,
  getAdvanced,
  createBook,
  updateBook,
  deleteBook,
  getAllAuthor,
  getAllGenre,
  getAllPublisher,
  getSimilarBooks,
};
