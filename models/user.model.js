const { DataTypes } = require("sequelize");
const JWT = require("jsonwebtoken");
const sequelize = require("../connection");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "users",
    getterMethods: {
      generateToken() {
        const token = JWT.sign(
          {
            id: this.id,
            email: this.email,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
            issuer: "amox-server",
          }
        );
        return token;
      },
      getFullName() {
        return this.firstName + " " + this.lastName;
      },
    },
    hooks: {
      beforeCreate: function (user, options) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
  }
);

module.exports = User;
