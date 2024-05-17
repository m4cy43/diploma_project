const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Book = require("../models/bookModel");
const Genre = require("../models/genreModel");
const Author = require("../models/authorModel");
const Section = require("../models/sectionModel");
const Publisher = require("../models/publisherModel");
const Isbn = require("../models/isbnModel");

const loadUserDataset = async (array) => {
  for (const obj of array) {
    const { email, password, name, surname, middlename, phone, roles } = obj;
    // Encryption & hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password.toString(), salt);
    const membership = generateMembership(10);
    // Create new user
    const user = await User.create({
      email: email,
      password: hash,
      membership: membership,
      name: name,
      surname: surname,
      middlename: middlename,
      phone: phone,
    });

    const roleArr = [];
    if (roles) {
      for (role of roles) {
        roleArr.push(
          await Role.findOrCreate({
            where: {
              role: role.role,
            },
          })
        );
      }
    }
    if (roleArr.length > 0) await user.addRoles(roleArr.map((x) => x[0]));
  }

  return "All users are loaded";
};

const loadBookDataset = async (array) => {
  for (const obj of array) {
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
      rate,
    } = obj;
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
      rate: parseFloat(rate),
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
    if (authorsArr.length > 0)
      await book.addAuthors(authorsArr.map((x) => x[0]));
    if (isbnsArr.length > 0) await book.addIsbns(isbnsArr.map((x) => x[0]));
    if (publisherFOC) await publisherFOC[0].addBook(book);
    if (sectionFOC) await sectionFOC[0].addBook(book);
  }

  return "All books are loaded";
};

const generateMembership = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

module.exports = {
  loadUserDataset,
  loadBookDataset,
};
