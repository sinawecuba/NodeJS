"use strict"; // Enforce strict mode to catch common mistakes

// Import mongoose for MongoDB object modeling
const mongoose = require("mongoose");

// Define the schema for Course collection
const courseSchema = new mongoose.Schema({
  // Title of the course
  title: {
    type: String, // Data type: String
    required: true, // Title is required
    unique: true // Title must be unique in the collection
  },

  // Description of the course
  description: {
    type: String, // Data type: String
    required: true // Description is required
  },

  // Items associated with the course
  items: [], // Array of items; no schema enforcement (flexible)

  // Zip code where course is offered
  zipCode: {
    type: Number, // Data type: Number
    min: [10000, "Zip code too short"], // Minimum 5-digit zip code; custom error message
    max: 99999 // Maximum valid 5-digit zip code
  }
});

// Export the model to use in controllers
module.exports = mongoose.model("Course", courseSchema); // Model name: "Course", linked to courseSchema
