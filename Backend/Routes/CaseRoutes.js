const express = require("express");
const router = express.Router();
const { addCase, UpdateCase } = require("../Controllers");

router.get("/cases", addCase);
router.get("/Updatecases", UpdateCase);
