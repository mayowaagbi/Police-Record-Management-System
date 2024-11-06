const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  addCriminal,
  getCriminal,
  getInvestigatorById,
} = require("../Controllers/UserController");
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
router.post("/register", verifyAdmin, registerUser);
router.post("/login", loginUser);
router.post("/crimmal", addCriminal);
router.get("/getcrimmal", getCriminal);

router.get("/investigators/:id", getInvestigatorById);

module.exports = router;
