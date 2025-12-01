"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT MONGOOSE ===
// Mongoose is an ODM (Object Data Modeling) library that allows us
// to define schemas and interact with a MongoDB database.
const mongoose = require("mongoose");

// === DEFINE COURSE SCHEMA ===
// This schema defines the structure of documents in the "courses" collection
const courseSchema = new mongoose.Schema({
  // Title of the course
  title: {
    type: String,   // Must be a string
    required: true, // This field is mandatory
    unique: true    // Each course title must be unique in the database
  },

  // Description of the course
  description: {
    type: String,   // Must be a string
    required: true  // This field is mandatory
  },

  // Items related to the course (like ingredients or materials)
  // Stored as an array (empty by default)
  items: [],

  // Zip code associated with the course
  zipCode: {
    type: Number, // Must be a number
    min: [10000, "Zip code too short"], // Minimum value validation
    max: 99999                        // Maximum value validation
  }
});

// === EXPORT COURSE MODEL ===
// This creates a Mongoose model named "Course" based on the courseSchema
// and allows interaction with the "courses" collection in MongoDB.
module.exports = mongoose.model("Course", courseSchema);
