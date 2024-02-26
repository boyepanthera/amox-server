const { DataTypes } = require("sequelize");

const sequelize = require("../connection");

const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "menus",
  }
);

module.exports = Menu;
