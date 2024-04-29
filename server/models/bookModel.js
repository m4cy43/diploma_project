const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Book = db.define(
  "book",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearPublish: {
      type: DataTypes.INTEGER(4),
      validator: {
        is: /(1[0-9]{3})|(20[0-9]{2})/,
      },
    },
    yearAuthor: {
      type: DataTypes.INTEGER(4),
      validator: {
        is: /(1[0-9]{3})|(20[0-9]{2})/,
      },
    },
    bibliography: {
      type: DataTypes.TEXT,
    },
    annotation: {
      type: DataTypes.TEXT,
    },
    physicalDescription: {
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.STRING,
    },
    udk: {
      type: DataTypes.STRING,
    },
    bbk: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: 0,
    },
    debtedNumber: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Book;
