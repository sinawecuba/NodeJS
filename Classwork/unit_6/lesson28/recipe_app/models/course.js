"use strict";

const mongoose = require("mongoose");

// =======================================
// Define the Course schema
// =======================================
const courseSchema = new mongoose.Schema({
  // Title of the course
  title: {
    type: String,     // Must be a string
    required: true,   // Required field
    unique: true      // No two courses can have the same title
  },

  // Description of the course
  description: {
    type: String,     // Must be a string
    required: true    // Required field
  },

  // List of items or topics included in the course
  items: [],          // Array of any type (can store strings or other data)

  // Zip code associated with the course (e.g., location-specific)
  zipCode: {
    type: Number,                    // Must be a number
    min: [10000, "Zip code too short"], // Minimum 5 digits
    max: 99999                        // Maximum 5 digits
  }
});

// =======================================
// Export the Course model
// =======================================
module.exports = mongoose.model("Course", courseSchema);
