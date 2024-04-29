const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Genre = require("./genreModel");
const Book = require("./bookModel");

const GenreRef = db.define(
  "genreRef",
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
    genreUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Genre,
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = GenreRef;
