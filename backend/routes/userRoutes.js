const express = require("express");
const router = express.Router();

const { register, login, getProfile, updateProfile, updateProfilePic, changePassword, setPassword, } = require("../controller/userController");

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");


router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);
router.post("/upload-profile-pic/:id", verifyToken, upload.single("profilePic"), updateProfilePic);

router.post("/set-password", verifyToken, setPassword);       // Google users
router.post("/change-password", verifyToken, changePassword); // Normal users



module.exports = router;
