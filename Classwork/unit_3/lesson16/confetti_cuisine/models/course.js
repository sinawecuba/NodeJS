"use strict";

// Import Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define a schema for Course documents
const courseSchema = new mongoose.Schema({
    title: {
        type: String,       // The title of the course must be a string
        required: true      // Title is required; cannot be empty
    },
    description: String,    // Optional course description (string)
    items: [String]         // Array of strings representing course items or topics
});

// Export the schema as a Mongoose model named "Course"
// This allows you to interact with the "courses" collection in MongoDB
module.exports = mongoose.model("Course", courseSchema);
