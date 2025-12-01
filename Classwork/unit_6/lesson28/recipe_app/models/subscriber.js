"use strict";

const mongoose = require("mongoose");

// =======================================
// Define the Subscriber schema
// =======================================
const subscriberSchema = new mongoose.Schema({
  // Subscriber's full name
  name: {
    type: String,     // Must be a string
    required: true    // Name is required
  },

  // Subscriber's email address
  email: {
    type: String,     // Must be a string
    required: true,   // Email is required
    lowercase: true,  // Store email in lowercase for consistency
    unique: true      // Email must be unique among subscribers
  },

  // Subscriber's zip code
  zipCode: {
    type: Number,                    // Must be a number
    min: [10000, "Zip code too short"], // Minimum 5 digits
    max: 99999                        // Maximum 5 digits
  },

  // Courses the subscriber is enrolled in
  courses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" } // Array of Course IDs (references Course model)
  ]
});

// =======================================
// Instance Methods
// =======================================

// Return a readable string with subscriber info
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Find all subscribers in the same zip code
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode })
    .exec(); // Returns a promise
};

// =======================================
// Export the Subscriber model
// =======================================
module.exports = mongoose.model("Subscriber", subscriberSchema);
