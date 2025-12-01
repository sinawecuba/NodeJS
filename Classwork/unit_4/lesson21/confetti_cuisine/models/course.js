"use strict"; // Enforces strict mode for cleaner, safer JavaScript

// === Import Mongoose Library ===
const mongoose = require("mongoose");

// === Define the Course Schema ===
// The schema defines the structure of documents stored in the "courses" collection.

const subscriberSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    zipCode: { type: Number, min: [10000, "Too short"], max: 99999 },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true });
const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    maxStudents: { type: Number, default: 0, min: [0, "Cannot be negative"] },
    cost: { type: Number, default: 0, min: [0, "Cannot be negative"] }
}, { timestamps: true });


// === Export the Model ===
// Creates and exports a Mongoose model named "Course" based on the schema above.
// Mongoose will automatically create/use the "courses" collection in MongoDB.
module.exports = mongoose.model("Course", courseSchema);
