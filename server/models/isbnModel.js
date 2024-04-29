const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Isbn = db.define(
  "isbn",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Isbn;
