const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Publisher = db.define(
  "publisher",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Publisher;
