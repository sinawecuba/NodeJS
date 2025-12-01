"use strict"; // Enforces strict mode to catch common coding mistakes and improve code safety

const mongoose = require("mongoose"); // Import Mongoose library to interact with MongoDB

// === DEFINE SCHEMA ===
// The schema defines the structure and rules for documents in the "Course" collection
const courseSchema = new mongoose.Schema({

  // Course title: must be unique and provided
  title: {
    type: String,    // Data type: String
    required: true,  // Validation: must be provided (cannot be empty)
    unique: true     // Ensures no duplicate course titles are allowed
  },

  // Course description: brief explanation of the course content
  description: {
    type: String,    // Data type: String
    required: true   // Validation: must be provided
  },

  // Course items: can store an array of lessons, topics, or materials
  items: [], // No type restriction here — it can hold various types (strings, objects, etc.)

  // Course location zip code: numeric value with validation limits
  zipCode: {
    type: Number,                       // Data type: Number
    min: [10000, "Zip code too short"], // Validation: must be at least 5 digits
    max: 99999                          // Validation: must not exceed 5 digits
  }
});

// === EXPORT MODEL ===
// Convert the schema into a model named "Course"
// This allows you to interact with the "courses" collection in MongoDB
module.exports = mongoose.model("Course", courseSchema);
