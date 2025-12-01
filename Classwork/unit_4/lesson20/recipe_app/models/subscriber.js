"use strict"; // Enforce strict mode for cleaner and safer JavaScript

const mongoose = require("mongoose"); // Import Mongoose

// Define schema for Subscriber collection
const subscriberSchema = new mongoose.Schema({
  // Subscriber's full name
  name: {
    type: String,       // Data type: String
    required: true      // Name is required
  },
  // Subscriber's email address
  email: {
    type: String,       // Data type: String
    required: true,     // Email is required
    lowercase: true,    // Store email in lowercase
    unique: true        // No duplicate emails allowed
  },
  // Subscriber's zip code
  zipCode: {
    type: Number,                  // Data type: Number
    min: [10000, "Zip code too short"], // Minimum valid 5-digit zip
    max: 99999                      // Maximum valid 5-digit zip
  },
  // Array of course IDs the subscriber is enrolled in
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

// Instance method to get subscriber info
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Instance method to find all subscribers in the same zip code
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode }) // Query by zipCode
    .exec();                         // Return a promise
};

// Export the Subscriber model based on the schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
