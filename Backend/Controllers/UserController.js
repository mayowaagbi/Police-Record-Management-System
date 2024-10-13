const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  // Log the incoming request body
  console.log("Incoming request body:", req.body);

  const { firstName, lastName, password, email } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    console.log("Validation failed: All fields are required.");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check for existing user
    const existingUser = await prisma.investigator.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists with email:", email);
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create new user
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

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await prisma.investigator.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // If password is valid, return user data or a token
    res.status(200).json({ message: "Login successful", user: existingUser });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

module.exports = { registerUser, loginUser };
