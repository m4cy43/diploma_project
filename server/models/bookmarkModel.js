const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const User = require("./userModel");
const Book = require("./bookModel");

const Bookmark = db.define(
  "bookmark",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    note: {
      type: DataTypes.STRING,
    },
    bookUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Book,
        key: "uuid",
      },
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Bookmark;
