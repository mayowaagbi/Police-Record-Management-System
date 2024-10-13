const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../Controllers/UserController");
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
