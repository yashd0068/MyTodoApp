const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("../model/user")(sequelize, DataTypes);
const Todo = require("../model/todo")(sequelize, DataTypes);



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token }); // we sent token to client 
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password) {
      return res.status(400).json({
        message: "Please login with Google or set a password",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.user_id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.passwordSet) {
      return res.status(400).json({ message: "Password already set : Change password" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.passwordSet = true;
    user.authType = "google+local";

    await user.save();

    res.json({ message: "Password set" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.user_id);

    if (!user || !user.passwordSet) {
      return res.status(400).json({ message: "Password not set yet" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(req.user.user_id, {
      attributes: ["user_id", "name", "email", "profilePic"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;


    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });


    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }
      user.email = email;
    }


    if (name) {
      user.name = name;
    }


    await user.save();


    res.json({ message: "Profile updated", name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;


    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = imagePath;
    await user.save();

    res.json({
      message: "Profile picture updated successfully!",
      profilePic: imagePath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};