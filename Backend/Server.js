const express = require("express");
const dotenv = require("dotenv");
const UserRoutes = require("");
const CaseRoutes = require("");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json);
app.use("/api/users", UserRoutes);
app.use("/api/Cases", CaseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
