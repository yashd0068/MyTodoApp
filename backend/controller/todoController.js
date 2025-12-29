const sequelize = require("../config/db");
const { DataTypes, Op } = require("sequelize");

const Todo = require("../model/todo")(sequelize, DataTypes);


exports.createTodo = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const user_id = req.user.user_id;

    const todo = await Todo.create({
      title,
      description,
      due_date,
      user_id,
    });

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating todo",
      error: err.message,
    });
  }
};


exports.getAllTodo = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const { search = "", page = 1, limit = 10, is_completed, sortBy = "createdAt", order = "DESC", } = req.query;

    const offset = (page - 1) * limit;

    const where = { user_id };


    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (limit === "all") {
      const todos = await Todo.findAll({
        where,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        todos, pagination: {
          totalTodos: todos.length, totalPages: 1, currentPage: 1, limit: "all",
        },
      });
    }

    // if (is_completed !== undefined) {
    //   where.is_completed = is_completed === "true";
    // }


    const allowedSortFields = ["createdAt", "due_date", "title"];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";


    const { rows: todos, count } = await Todo.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[safeSortBy, safeOrder]],
    });

    res.status(200).json({
      todos, pagination:
      {
        totalTodos: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching todos",
      error: err.message,
    });
  }
};


exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const todo = await Todo.findOne({
      where: { todo_id: id, user_id },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching todo",
      error: err.message,
    });
  }
};


exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const { title, description, due_date, is_completed } = req.body;

    const todo = await Todo.findOne({
      where: { todo_id: id, user_id },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await todo.update({
      title,
      description,
      due_date,
      is_completed,
    });

    res.status(200).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating todo",
      error: err.message,
    });
  }
};


exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const todo = await Todo.findOne({
      where: { todo_id: id, user_id },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await todo.destroy();

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting todo",
      error: err.message,
    });
  }
};
