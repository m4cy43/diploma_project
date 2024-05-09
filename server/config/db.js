const { Sequelize, DataTypes, where } = require("sequelize");

const [database, user, password, host, port] = [
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_HOST,
  process.env.DB_PORT,
];

// Sequelize bd connection
const db = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: "mysql",
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: 100,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {},
  timezone: "+03:00",
});

const syncAllTables = async () => {
  // All Models
  const User = require("../models/userModel");
  const Role = require("../models/roleModel");
  const RoleRef = require("../models/roleRefModel");
  const Section = require("../models/sectionModel");
  const Publisher = require("../models/publisherModel");
  const Book = require("../models/bookModel");
  const Author = require("../models/authorModel");
  const AuthorRef = require("../models/authorRefModel");
  const Genre = require("../models/genreModel");
  const GenreRef = require("../models/genreRefModel");
  const Userbook = require("../models/userBookModel");
  const Isbn = require("../models/isbnModel");

  // Associations
  User.belongsToMany(Role, { through: RoleRef });
  Role.belongsToMany(User, { through: RoleRef });

  User.belongsToMany(Book, { through: Userbook });
  Book.belongsToMany(User, { through: Userbook });

  Author.belongsToMany(Book, { through: AuthorRef });
  Book.belongsToMany(Author, { through: AuthorRef });

  Genre.belongsToMany(Book, { through: GenreRef });
  Book.belongsToMany(Genre, { through: GenreRef });

  Section.hasMany(Book);
  Book.belongsTo(Section);

  Publisher.hasMany(Book);
  Book.belongsTo(Publisher);

  Book.hasMany(Isbn);
  Isbn.belongsTo(Book);

  // Sync all defined models to the DB
  await db
    .sync()
    .then((data) => {
      console.log(`All tables and it models are synced`);
    })
    .catch((err) => {
      console.log(`Tables sync error`);
      throw err;
    });
};

module.exports = { db, syncAllTables };
