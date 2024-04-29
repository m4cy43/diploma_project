const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./userModel");
const Role = require("./roleModel");

const RoleRef = db.define(
  "RoleRef",
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "uuid",
      },
    },
    roleUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Role,
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = RoleRef;
