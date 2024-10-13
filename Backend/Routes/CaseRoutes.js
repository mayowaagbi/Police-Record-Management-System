const express = require("express");
const router = express.Router();
// const { addCase, UpdateCase } = require("../Controllers");
// router.get("/cases", addCase);
// router.get("/Updatecases", UpdateCase);
const {
  getCases,
  addCase,
  updateCase,
} = require("../Controllers/CaseController");

router.get("/cases", getCases);
router.post("/cases", addCase);
router.put("/cases/:id", updateCase);

module.exports = router;
