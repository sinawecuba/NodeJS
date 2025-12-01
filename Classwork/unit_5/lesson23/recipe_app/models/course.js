"use strict"; // Enforce strict mode to catch common coding mistakes and enforce best practices

// Import mongoose, the MongoDB ODM (Object Data Modeling) library
const mongoose = require("mongoose");

/**
 * Define the schema (structure) for the Course collection.
 * This schema determines how course documents are stored in MongoDB.
 */
const courseSchema = new mongoose.Schema({
  // The course title: must be unique and is required
  title: {
    type: String,
    required: true,  // Field is mandatory
    unique: true     // No two courses can have the same title
  },

  // The course description: provides details about the course
  description: {
    type: String,
    required: true   // Field is mandatory
  },

  // A list of related items (e.g., lessons, topics, or materials)
  // Schema left open to accept any type of array elements
  items: [],

  // The postal or zip code associated with the course (e.g., location-based courses)
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],  // Validation: must be at least 5 digits
    max: 99999                           // Validation: cannot exceed 5 digits
  }
});

// Export the Course model so it can be used in other files (controllers, routes, etc.)
// Mongoose will create a "courses" collection based on this model
module.exports = mongoose.model("Course", courseSchema);
