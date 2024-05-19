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
    originalTitle: {
      type: DataTypes.STRING,
    },
    yearPublish: {
      type: DataTypes.STRING,
      // type: DataTypes.INTEGER(4),
      validate: {
        is: /(1[0-9]{3})|(20[0-9]{2})|(_)/,
      },
    },
    yearAuthor: {
      type: DataTypes.STRING,
      // type: DataTypes.INTEGER(4),
      validate: {
        is: /(1[0-9]{3})|(20[0-9]{2})|(_)/,
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
    rate: {
      type: DataTypes.DOUBLE,
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
    createdAt: {
      type: DataTypes.DATE(6),
    },
    updatedAt: {
      type: DataTypes.DATE(6),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Book;
