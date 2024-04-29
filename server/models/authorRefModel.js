const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Author = require("./authorModel");
const Book = require("./bookModel");

const AuthorRef = db.define(
  "authorRef",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    bookUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Book,
        key: "uuid",
      },
    },
    authorUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Author,
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AuthorRef;
