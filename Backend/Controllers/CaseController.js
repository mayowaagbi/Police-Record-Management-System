const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Function to get all cases
const getCases = async (req, res) => {
  try {
    const cases = await prisma.case.findMany();
    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ error: "An error occurred while fetching cases." });
  }
};

// Middleware to handle file uploads
const uploadSingle = upload.single("files"); // Change 'files' to match the key from the front end

// Function to add a new case
const addCase = async (req, res) => {
  const {
    suspectFirstName,
    suspectLastName,
    officerFirstName,
    officerLastName,
    suspectRole,
    caseDescription,
    location,
    userId, // Received as userId from the frontend
  } = req.body;
  const file = req.file;

  // Ensure userId is a string (if it's an array, take the first element)
  const validUserId = Array.isArray(userId) ? userId[0] : userId;

  // Validate required fields
  if (
    !suspectFirstName ||
    !suspectLastName ||
    !officerFirstName ||
    !officerLastName ||
    !suspectRole ||
    !caseDescription ||
    !location ||
    !validUserId
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // If a file is uploaded, save it to your storage
    let fileUrl = null;
    if (file) {
      fileUrl = path.join("/uploads", file.filename); // Save the file URL in the database
    }

    // Check if a Criminal record exists for this suspect
    let criminal = await prisma.criminal.findFirst({
      where: {
        firstName: suspectFirstName,
        lastName: suspectLastName,
      },
    });

    // Create a Criminal record if none exists
    if (!criminal) {
      criminal = await prisma.criminal.create({
        data: {
          firstName: suspectFirstName,
          lastName: suspectLastName,
        },
      });
    }

    const newCase = await prisma.case.create({
      data: {
        suspectFirstName,
        suspectLastName,
        officerFirstName,
        officerLastName,
        suspectRole,
        caseDescription,
        location,
        fileUrl,
        criminalId: criminal.id, // Link the case to the criminal
        investigatorId: validUserId, // Use the valid userId (first item if array)
      },
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error("Error adding case:", error);
    res.status(500).json({ error: "An error occurred while adding the case." });
  }
};

// Function to update an existing case
const updateCase = async (req, res) => {
  const { id } = req.params;
  const { title, description, investigatorId } = req.body;

  // Validate required fields
  if (!title || !description || !investigatorId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updatedCase = await prisma.case.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        investigatorId,
      },
    });

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the case." });
  }
};

// Function to delete a case by ID
const deleteCase = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCase = await prisma.case.delete({
      where: { id: String(id) },
    });

    res.status(200).json({ message: "Case deleted successfully", deletedCase });
  } catch (error) {
    console.error("Error deleting case:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the case." });
  }
};

module.exports = {
  getCases,
  addCase,
  updateCase,
  deleteCase,
  uploadSingle,
};
