"use strict"; // Enforces strict mode to catch coding errors and enforce best practices

const mongoose = require("mongoose"); // Import Mongoose to define schema and interact with MongoDB

// === DEFINE SUBSCRIBER SCHEMA ===
// This schema defines the structure and validation rules for "Subscriber" documents
const subscriberSchema = new mongoose.Schema({

  // Subscriber's full name
  name: {
    type: String,   // Data type: String
    required: true  // Validation: must be provided
  },

  // Subscriber's email address
  email: {
    type: String,     // Data type: String
    required: true,   // Validation: must be provided
    lowercase: true,  // Automatically convert email to lowercase before saving
    unique: true      // Ensures no two subscribers have the same email address
  },

  // Subscriber's postal/ZIP code
  zipCode: {
    type: Number,                        // Data type: Number
    min: [10000, "Zip code too short"],  // Validation: must be at least 5 digits
    max: 99999                           // Validation: must not exceed 5 digits
  },

  // Array of courses the subscriber is linked to
  // Stores ObjectIds that reference "Course" documents
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, // Reference type (ObjectId)
    ref: "Course"                         // Refers to the "Course" model
  }]
});


// === INSTANCE METHOD: getInfo ===
// Purpose: Returns a formatted string containing subscriber details
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};


// === INSTANCE METHOD: findLocalSubscribers ===
// Purpose: Finds all subscribers who share the same ZIP code as the current subscriber
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")   // Access the Subscriber model
    .find({ zipCode: this.zipCode }) // Find all with matching zipCode
    .exec();                         // Execute the query and return a promise
};


// === EXPORT MODEL ===
// Convert the schema into a model named "Subscriber"
// This allows interacting with the "subscribers" collection in MongoDB
module.exports = mongoose.model("Subscriber", subscriberSchema);
