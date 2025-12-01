"use strict"; // Enforce strict mode for safer, cleaner JavaScript

// === Import Mongoose Library ===
const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema from mongoose for easier reference

// === Define the Subscriber Schema ===
// The schema defines the structure and rules for Subscriber documents in MongoDB.
const subscriberSchema = new Schema({
    // Name of the subscriber (required string)
    name: { type: String, required: true },
    // Email of the subscriber (required, lowercase, must be unique)
    email: { type: String, required: true, lowercase: true, unique: true },
    // Zip code of the subscriber (number between 10000 and 99999)
    zipCode: { type: Number, min: [10000, "Too short"], max: 99999 },
    // Array of Course IDs the subscriber is enrolled in
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// === Define the Course Schema ===
// Optional: schema for course documents (not exported here)
const courseSchema = new Schema({
    title: { type: String, required: true }, // Course title (required)
    description: { type: String, required: true }, // Course description (required)
    maxStudents: { type: Number, default: 0, min: [0, "Cannot be negative"] }, // Maximum students allowed
    cost: { type: Number, default: 0, min: [0, "Cannot be negative"] } // Cost of the course
}, { timestamps: true });

// === Export the Subscriber Model ===
// This creates a Mongoose model named "Subscriber" from the schema.
// Mongoose will automatically map this model to the "subscribers" collection in MongoDB.
module.exports = mongoose.model("Subscriber", subscriberSchema);
