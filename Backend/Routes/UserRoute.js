const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  addCriminal,
  getCriminal,
  getInvestigatorById,
} = require("../Controllers/UserController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/crimmal", addCriminal);
router.get("/getcrimmal", getCriminal);

router.get("/investigators/:id", getInvestigatorById);

module.exports = router;
