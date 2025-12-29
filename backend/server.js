require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.use("/api/auth", require("./routes/authRoutes"));




app.get("/", (req, res) => res.send("API is running..."));

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Sync error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
