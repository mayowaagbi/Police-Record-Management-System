const express = require("express");
const router = express.Router();

const { registerUser, LoginUser } = require("../Controllers/UserController");

router.post("/register", registerUser);
router.post("/login", LoginUser);
module.exports = router;
