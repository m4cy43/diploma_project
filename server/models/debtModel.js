const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const User = require("./userModel");
const Book = require("./bookModel");

const Debt = db.define(
  "debt",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    deadline: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
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

module.exports = Debt;
