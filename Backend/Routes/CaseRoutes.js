const express = require("express");
const router = express.Router();
const {
  getCases,
  addCase,
  updateCase,
  deleteCase,
} = require("../Controllers/CaseController");
const multer = require("multer");
const path = require("path");

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const verifyAdmin = (req, res, next) => {
  // Get the role from the request header (sent by the client)
  const userRole = req.headers["x-user-role"];

  if (!userRole) {
    return res.status(401).json({ error: "Unauthorized, no role provided." });
  }

  if (userRole !== "ADMIN") {
    return res.status(403).json({ error: "Access denied: Admins only." });
  }

  next(); // Proceed to the next middleware or route handler
};

router.get("/getcases", getCases);
router.post("/addcases", upload.single("files"), addCase);
router.put("/cases/:id", updateCase);
router.delete("/cases/:id", verifyAdmin, deleteCase);

module.exports = router;
