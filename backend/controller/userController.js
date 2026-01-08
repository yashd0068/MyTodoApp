const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("../model/user")(sequelize, DataTypes);
const Todo = require("../model/todo")(sequelize, DataTypes);
const crypto = require("crypto");
const { Op } = require("sequelize");
const transporter = require("../config/mailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      authType: "local",       // Explicitly set
      passwordSet: true        // ← Critical fix: now local users have password set
    });

    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password || !user.passwordSet) {
      return res.status(400).json({
        message: "No password set. Please login with Google/GitHub or set a password first.",
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
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.user_id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.passwordSet) {
      return res.status(400).json({
        message: "You already have a password set. Use 'Change Password' instead.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await user.update({
      password: hashed,
      passwordSet: true,
      authType: "local", // Now they can log in directly with email/password
    });

    res.json({ message: "Password set successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.user_id);

    if (!user || !user.passwordSet || !user.password) {
      return res.status(400).json({
        message: "You don't have a password set yet. Please set one first.",
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(req.user.user_id, {
      attributes: [
        "user_id",
        "name",
        "email",
        "profilePic",
        "authType",     // ← Needed for frontend logic
        "passwordSet"   // ← Crucial to decide Set vs Change Password
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      authType: user.authType,
      passwordSet: user.passwordSet,
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
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      name: user.name,
      email: user.email,
    });
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email. Please check or sign up."
      });
    }

    if (!user.passwordSet) {
      return res.status(400).json({
        message: "This account uses social login. Please login with your OAuth provider.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({
      resetOTP: otp,
      resetOTPExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP for password reset:</h2><h1 style="color:blue;">${otp}</h1><p>This OTP is valid for 10 minutes only.</p>`,
    });

    return res.status(200).json({
      message: "OTP sent successfully to your email"
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      where: {
        email,
        resetOTP: otp,
        resetOTPExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed,
      passwordSet: true,
      authType: "local", // Since they now have a local password
      resetOTP: null,
      resetOTPExpiry: null,
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};