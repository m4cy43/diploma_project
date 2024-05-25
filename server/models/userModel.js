const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const User = db.define(
  "user",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    membership: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    surname: {
      type: DataTypes.STRING,
    },
    middlename: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: /^(00|\+)?([0-9]{1,5})?([0-9]{10})$/,
      },
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

module.exports = User;
