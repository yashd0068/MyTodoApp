const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("todo_app", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

sequelize
  .authenticate()
  .then(() => console.log("SQL connected"))
  .catch((err) => console.log("Error connecting to MySQL:", err));

module.exports = sequelize;
