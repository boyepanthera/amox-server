const express = require("express");
const bcrypt = require("bcrypt");
const server = express();
const User = require("./models/user.model");
const Menu = require("./models/menu.model");
const sequelize = require("./connection");
const {
  validateSignupData,
  validateLoginData,
  validateMenuData,
  validateMenuUpdateData,
} = require("./validators");
const port = process.env.PORT || 5001;

server.use(express.json({}));
server.use(express.urlencoded({ extended: false }));

server.get("/", function (req, res) {
  return res.status(200).json({ message: "amox server" });
});

server.post("/signup", async function (req, res) {
  try {
    const { err } = validateSignupData(req.body);
    if (err) {
      return res.status(400).json({
        message: err.details[0].message,
      });
    }

    const userAlreadyExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create(req.body);
    const token = user.generateToken;
    return res.status(201).json({
      message: "account created successfully",
      token: token,
    });
  } catch (err) {
    console.log(err.message);
  }
});

server.post("/login", async (req, res) => {
  try {
    const { err } = validateLoginData(req.body);
    if (err) {
      return res.status(400).json({
        message: err.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    const validPassword = bcrypt.compare(req.body.password, user.password);
    console.log(validPassword);

    if (!validPassword) {
      return res.status(400).json({
        message: "incorrect login credentials",
      });
    }
    const token = user.generateToken;
    return res.status(200).json({ message: "login successful", token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "server error",
    });
  }
});

server.post("/menu", async function (req, res) {
  try {
    const { err, value } = validateMenuData(req.body);
    if (err)
      return res.status(400).json({
        message: err.details[0].message,
      });

    const menu = await Menu.create(value);
    return res.status(200).json({
      message: "menu created",
      menu: menu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "server error",
    });
  }
});

server.get("/menu", async function (req, res) {
  try {
    const menus = await Menu.findAll();
    return res
      .status(200)
      .json({ messagea: "menu fetched successfully", menus: menus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

server.get("/menu/:menuId", async function (req, res) {
  try {
    const menu = await Menu.findByPk(req.params.menuId);
    if (!menu) {
      return res.status(404).json({
        message: "menu not found",
      });
    }
    return res
      .status(200)
      .json({ messagea: "menu fetched successfully", menu: menu });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

server.put("/menu/:menuId", async function (req, res) {
  try {
    const { err, value } = validateMenuUpdateData(req.body);
    if (err)
      return res.status(400).json({
        message: err.details[0].message,
      });
    const menuId = req.params.menuId;
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).json({
        message: "menu not found",
      });
    }
    await menu.update(value);
    return res.status(200).json({
      message: "menu updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

server.delete("/menu/:menuId", async function (req, res) {
  try {
    const menuId = req.params.menuId;
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).json({
        message: "menu not found",
      });
    }
    await menu.destroy();
    return res.status(200).json({
      message: "menu deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

server.listen(port, async function () {
  console.log("server started on port " + port);

  try {
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
