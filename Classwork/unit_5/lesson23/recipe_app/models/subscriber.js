"use strict"; // Enable strict mode to enforce cleaner, safer JavaScript

// Import mongoose, a MongoDB Object Data Modeling (ODM) library
const mongoose = require("mongoose");

/**
 * Define the schema for the Subscriber collection.
 * This determines the structure and validation rules for each subscriber document.
 */
const subscriberSchema = new mongoose.Schema({
  // Subscriber's full name — required field
  name: {
    type: String,
    required: true
  },

  // Subscriber's email address — must be unique and lowercase
  email: {
    type: String,
    required: true,
    lowercase: true, // Automatically converts email to lowercase
    unique: true     // Prevents duplicate email addresses in the database
  },

  // Subscriber's postal/zip code — must be a valid 5-digit number
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"], // Validation: at least 5 digits
    max: 99999                          // Validation: no more than 5 digits
  },

  // Array of course references — connects subscribers to enrolled courses
  // Each element stores an ObjectId referencing a Course document
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

/**
 * Instance method: getInfo()
 * Returns a formatted string with basic subscriber details.
 * Useful for logging or displaying subscriber info.
 */
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

/**
 * Instance method: findLocalSubscribers()
 * Finds other subscribers who share the same zip code as the current subscriber.
 * Returns a Promise that resolves with the list of matching subscribers.
 */
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")        // Access the Subscriber model
    .find({ zipCode: this.zipCode })     // Filter by same zip code
    .exec();                             // Execute the query and return a Promise
};

// Export the model to make it available for import in other files
// Mongoose will automatically create a "subscribers" collection in MongoDB
module.exports = mongoose.model("Subscriber", subscriberSchema);
