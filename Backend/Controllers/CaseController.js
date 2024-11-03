const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

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

// Function to add a new case
const addCase = async (req, res) => {
  const { title, description, investigatorId } = req.body;

  // Validate required fields
  if (!title || !description || !investigatorId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        investigatorId,
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

module.exports = {
  getCases,
  addCase,
  updateCase,
  registerUser,
};
