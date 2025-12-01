"use strict"; // Enforce strict mode for cleaner and safer JavaScript

// === IMPORT MONGOOSE ===
// Mongoose allows us to define schemas and interact with a MongoDB database
const mongoose = require("mongoose");

// === DEFINE SUBSCRIBER SCHEMA ===
// This schema defines the structure of documents in the "subscribers" collection
const subscriberSchema = new mongoose.Schema({
  // Subscriber's name
  name: {
    type: String,   // Must be a string
    required: true  // This field is mandatory
  },

  // Subscriber's email
  email: {
    type: String,   // Must be a string
    required: true, // Mandatory field
    lowercase: true, // Convert email to lowercase before saving
    unique: true     // Ensure no duplicate emails
  },

  // Subscriber's zip code
  zipCode: {
    type: Number,   // Must be a number
    min: [10000, "Zip code too short"], // Minimum value validation
    max: 99999                         // Maximum value validation
  },

  // Courses associated with the subscriber
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, // Store MongoDB ObjectId
    ref: "Course"                         // Reference the "Course" model
  }]
});

// === INSTANCE METHOD: getInfo ===
// Returns a formatted string containing subscriber's name, email, and zip code
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// === INSTANCE METHOD: findLocalSubscribers ===
// Finds all subscribers in the database who have the same zip code as this subscriber
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode }) // Query by zip code
    .exec(); // Return a promise
};

// === EXPORT SUBSCRIBER MODEL ===
// Creates the "Subscriber" model from the schema
// Provides methods like .find(), .create(), .save(), etc.
module.exports = mongoose.model("Subscriber", subscriberSchema);
