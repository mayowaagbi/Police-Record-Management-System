const express = require("express");
const dotenv = require("dotenv");
const UserRoutes = require("./Routes/UserRoute");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/users", UserRoutes);

// app.use("/", (req, res) => {
//   res.send("hello");
// });
// app.use("/api/Cases", CaseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
