"use strict";

// Import Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define a schema for User documents
const userSchema = new mongoose.Schema({
    name: { // Nested object for first and last name
        first: { type: String, trim: true }, // First name (string), remove extra whitespace
        last: { type: String, trim: true }   // Last name (string), remove extra whitespace
    },
    email: { // User's email
        type: String,      // Must be a string
        required: true,    // Required field
        lowercase: true,   // Convert email to lowercase
        unique: true       // Ensure no duplicate emails in the database
    },
    zipCode: { // User's ZIP code
        type: Number,           // Must be a number
        min: [1000, "Zip code too short"], // Minimum value with custom error message
        max: 99999              // Maximum value
    },
    courses: [{ // Array of course references
        type: mongoose.Schema.Types.ObjectId, // Store ObjectId of related Course documents
        ref: "Course"                         // Reference the "Course" model for population
    }]
});

// Virtual property to get full name of the user
userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`; // Concatenate first and last names
});

// Export the schema as a Mongoose model named "User"
// This allows interaction with the "users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
