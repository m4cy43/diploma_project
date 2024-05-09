const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const User = require("./userModel");
const Book = require("./bookModel");

const Userbook = db.define(
  "userbook",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      validate: {
        is: /(20[0-9]{2})-([0-1][0-9])-([0-3][0-9])/,
      },
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
  }
);

module.exports = Userbook;
