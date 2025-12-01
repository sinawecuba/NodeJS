"use strict"; // Enables strict mode for safer and cleaner JavaScript execution

const mongoose = require("mongoose"); // Imports Mongoose library for MongoDB interaction
const { Schema } = mongoose; // Destructures Schema from Mongoose for defining data structures

// Define the schema for the "Course" collection
const courseSchema = new Schema(
  {
    title: { type: String, required: true }, // Course title (required field)
    description: { type: String, required: true }, // Course description (required field)
    maxStudents: { 
      type: Number, 
      default: 0, // Default value if none provided
      min: [0, "Cannot be negative"] // Prevents negative student counts
    },
    cost: { 
      type: Number, 
      default: 0, // Default cost if not specified
      min: [0, "Cannot be negative"] // Ensures cost cannot be negative
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Exports the model so it can be used throughout the app
module.exports = mongoose.model("Course", courseSchema);
