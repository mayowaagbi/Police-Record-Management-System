const express = require("express");
const dotenv = require("dotenv");
const UserRoutes = require("./Routes/UserRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS options
const corsOptions = {
  origin: "http://localhost:5173", // Allow your frontend to access the backend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (like cookies) to be sent
};

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Apply middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions)); // Only apply the configured CORS options here

// Routes
app.use("/users", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // app.use("/", (req, res) => {
// //   res.send("hello");
// // });
