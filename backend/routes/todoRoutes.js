const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const todoController = require("../controller/todoController");

router.post("/", verifyToken, todoController.createTodo);
router.get("/", verifyToken, todoController.getAllTodo);
router.get("/:id", verifyToken, todoController.getTodoById);
router.put("/:id", verifyToken, todoController.updateTodo);
router.delete("/:id", verifyToken, todoController.deleteTodo);
//router.get("/:id", verifyToken, todoController.getTodoById);


module.exports = router;
