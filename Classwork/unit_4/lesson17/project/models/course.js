"use strict"; // Enforces strict mode to help catch common coding mistakes and unsafe actions

const mongoose = require("mongoose"); // Import Mongoose library for MongoDB object modeling
const { Schema } = mongoose; // Destructure Schema from mongoose for easier access

// Define a new schema for the "Course" collection
const courseSchema = new Schema(
    {
        // Course title: must be a unique, non-empty string
        title: {
            type: String, // Data type: String
            required: [true, "Title required"], // Validation: field is mandatory
            unique: true, // No two courses can have the same title
            trim: true // Automatically remove extra spaces around the title
        },

        // Course description: optional, with a default message if not provided
        description: {
            type: String, // Data type: String
            default: "No description provided" // Default value when field is empty
        },

        // List of course items (e.g., lessons, topics, materials)
        items: [String], // Array of strings

        // Zip code: must be a number within the valid range
        zipCode: {
            type: Number, // Data type: Number
            min: [10000, "Zip code too small"], // Minimum allowed value
            max: [99999, "Zip code too large"] // Maximum allowed value
        }
    },
    {
        // Automatically add createdAt and updatedAt fields
        timestamps: true
    }
);

// Export the Course model so it can be used elsewhere in the app
module.exports = mongoose.model("Course", courseSchema);
