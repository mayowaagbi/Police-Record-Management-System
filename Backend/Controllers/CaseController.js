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
// const updateCase = async (req, res) => {
//   const { id } = req.params;
//   const {
//     suspectFirstName,
//     suspectLastName,
//     officerFirstName,
//     officerLastName,
//     caseDescription,
//     fileUrl,
//     suspectRole,
//   } = req.body;

//   // Validate required fields
//   // if (
//   //   !suspectFirstName ||
//   //   !suspectLastName ||
//   //   !officerFirstName ||
//   //   !officerLastName ||
//   //   !caseDescription ||
//   //   !fileUrl ||
//   //   !suspectRole
//   // ) {
//   //   return res.status(400).json({ error: "All fields are required." });
//   // }

//   try {
//     const updatedCase = await prisma.case.update({
//       where: { id: id },
//       data: {
//         suspectFirstName,
//         suspectLastName,
//         officerFirstName,
//         officerLastName,
//         caseDescription,
//         fileUrl,
//         suspectRole,
//       },
//     });

//     // Return the updated case data as the response
//     res.status(200).json(updatedCase);
//   } catch (error) {
//     console.error("Error updating case:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the case." });
//   }
// };
const updateCase = async (req, res) => {
  const { id } = req.params;
  const {
    suspectFirstName,
    suspectLastName,
    officerFirstName,
    officerLastName,
    caseDescription,
    fileUrl,
    suspectRole,
  } = req.body;

  const updatedData = {};

  // Add fields only if they are provided in the request
  if (suspectFirstName) updatedData.suspectFirstName = suspectFirstName;
  if (suspectLastName) updatedData.suspectLastName = suspectLastName;
  if (officerFirstName) updatedData.officerFirstName = officerFirstName;
  if (officerLastName) updatedData.officerLastName = officerLastName;
  if (caseDescription) updatedData.caseDescription = caseDescription;
  if (fileUrl) updatedData.fileUrl = fileUrl;
  if (suspectRole) updatedData.suspectRole = suspectRole;

  try {
    const updatedCase = await prisma.case.update({
      where: { id: id },
      data: updatedData,
    });

    // Return the updated case data as the response
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
      where: { id: id },
    });

    res.status(200).json({ message: "Case deleted successfully", deletedCase });
  } catch (error) {
    console.error("Error deleting case:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the case." });
  }
};
const getGenderRatio = async (req, res) => {
  try {
    // Query to count cases based on user gender
    const genderRatioData = await prisma.case.groupBy({
      by: ["investigatorId"],
      _count: {
        investigatorId: true,
      },
    });

    // Fetch user details separately
    const userIds = genderRatioData.map((entry) => entry.investigatorId);
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        gender: true,
      },
    });

    // Calculate gender counts based on the data
    const genderCounts = {
      male: 0,
      female: 0,
    };

    // Count the number of male and female cases
    genderRatioData.forEach((entry) => {
      const user = users.find((u) => u.id === entry.investigatorId);
      if (user && user.gender === "Male") {
        genderCounts.male += entry._count.investigatorId;
      } else if (user && user.gender === "Female") {
        genderCounts.female += entry._count.investigatorId;
      }
    });

    const result = [
      { gender: "Male", cases: genderCounts.male, fill: "var(--color-male)" },
      {
        gender: "Female",
        cases: genderCounts.female,
        fill: "var(--color-female)",
      },
    ];

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching gender ratio:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching gender ratio" });
  }
};
const getMonthlyCases = async (req, res) => {
  try {
    const cases = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT("createdAt", '%M %Y') AS month,
        COUNT(*) AS cases
      FROM \`Case\`
      GROUP BY month
      ORDER BY "createdAt" ASC
    `;

    // Validate and format the result to handle BigInt serialization issues
    const monthlyCases = cases.map((item) => {
      return {
        month: item.month ? item.month.trim() : "Unknown Month", // Handle null/invalid month
        cases: item.cases ? item.cases.toString() : "0", // Convert BigInt to string
      };
    });

    res.json(monthlyCases); // Send the result to the frontend
  } catch (error) {
    console.error("Error fetching monthly cases:", error);
    res.status(500).json({ error: "Failed to fetch monthly cases data." });
  }
};

module.exports = {
  getCases,
  addCase,
  updateCase,
  deleteCase,
  uploadSingle,
  getGenderRatio,
  getMonthlyCases,
};
