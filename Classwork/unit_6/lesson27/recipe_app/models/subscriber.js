"use strict"; // Enforce strict mode to catch errors

// Import mongoose for MongoDB object modeling
const mongoose = require("mongoose");

// Define schema for Subscriber collection
const subscriberSchema = new mongoose.Schema({
  // Subscriber's full name
  name: {
    type: String, // Data type: String
    required: true // Name is required
  },

  // Subscriber's email address
  email: {
    type: String, // Data type: String
    required: true, // Email is required
    lowercase: true, // Always store email in lowercase
    unique: true // Ensure no duplicate emails
  },

  // Subscriber's zip code
  zipCode: {
    type: Number, // Data type: Number
    min: [10000, "Zip code too short"], // Minimum 5-digit zip code with custom error message
    max: 99999 // Maximum 5-digit zip code
  },

  // Array of courses the subscriber is enrolled in
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }] 
  // Stores ObjectIds referencing the Course model
});

// ----------------------------
// INSTANCE METHODS
// ----------------------------

// Method to get basic info about subscriber
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Method to find all subscribers in the same zip code
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber") // Access the Subscriber model
    .find({ zipCode: this.zipCode }) // Query for same zip code
    .exec(); // Return a promise
};

// Export the model to use in controllers
module.exports = mongoose.model("Subscriber", subscriberSchema); 
// Model name: "Subscriber", linked to subscriberSchema
