const express = require("express");
const router = express.Router();

const { register, login, getProfile, updateProfile, updateProfilePic, changePassword, setPassword, resetPassword, verifyOTP, forgotPassword } = require("../controller/userController");

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");


router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);
router.post("/upload-profile-pic/:id", verifyToken, upload.single("profilePic"), updateProfilePic);

router.post("/set-password", verifyToken, setPassword);
router.post("/change-password", verifyToken, changePassword);

router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);






module.exports = router;



