const express = require("express");
const router = express.Router();
const { googleAuth } = require("../controller/authController");
const { githubAuth } = require("../controller/githubAuth");
const { facebookAuth } = require("../controller/facebookAuth");

router.post("/google", googleAuth);
router.post("/github", githubAuth);


router.post("/facebook", facebookAuth);


module.exports = router;





