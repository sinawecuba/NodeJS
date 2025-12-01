"use strict"; // Enforce strict mode for safer and cleaner JavaScript

const mongoose = require("mongoose"); // Import Mongoose

// Define schema for Course collection
const courseSchema = new mongoose.Schema({
  // Course title
  title: {
    type: String,       // Data type: String
    required: true,     // Title is required
    unique: true        // No two courses can have the same title
  },
  // Course description
  description: {
    type: String,       // Data type: String
    required: true      // Description is required
  },
  // Items/materials for the course
  items: [],            // Array of items (Strings, can store ingredients or materials)
  
  // Zip code associated with the course (location)
  zipCode: {
    type: Number,               // Data type: Number
    min: [10000, "Zip code too short"], // Minimum value validation
    max: 99999                  // Maximum value validation
  }
});

// Export the Course model based on the schema
module.exports = mongoose.model("Course", courseSchema);
