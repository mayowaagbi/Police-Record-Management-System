const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// const jwtSecret = env(JWT_SECRET);
JWT_SECRET = "e8f3b2d45a7c8e3f9a6b5c1d9f0a2d3b";
const registerUser = async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { firstName, lastName, password, email } = req.body.data; // Access data from the "data" field

  if (!firstName || !lastName || !email || !password) {
    console.log("Validation failed: All fields are required.");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await prisma.investigator.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists with email:", email);
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = await prisma.investigator.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    console.log("New user created:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await prisma.investigator.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const userdata = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
      email: existingUser.email,
    };

    // Set the token as a cookie
    res.cookie("user", userdata, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    // Send only one JSON response
    res.status(200).json({
      message: "Login successful",
      token, // Optional, if you want to use it on the front end without cookies
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};
const getCriminal = async (req, res) => {
  try {
    const criminals = await prisma.criminal.findMany();
    res.status(200).json(criminals);
  } catch (error) {
    console.error("Error fetching criminals:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching criminals." });
  }
};

const addCriminal = async (req, res) => {
  const { firstName, lastName, crime } = req.body;

  if (!firstName || !lastName || !crime) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newCriminal = await prisma.criminal.create({
      data: {
        firstName,
        lastName,
        crime,
      },
    });

    res.status(201).json(newCriminal);
  } catch (error) {
    console.error("Error adding criminal:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the criminal." });
  }
};

const getInvestigatorById = async (req, res) => {
  const { id } = req.params;

  try {
    const investigator = await prisma.investigator.findUnique({
      where: { id: Number(id) },
    });

    if (!investigator) {
      return res.status(404).json({ error: "Investigator not found." });
    }

    res.status(200).json(investigator);
  } catch (error) {
    console.error("Error fetching investigator:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the investigator." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCriminal,
  addCriminal,
  getInvestigatorById,
};
