"use strict"; // Enforces strict mode for better coding practices and fewer silent errors

// Import Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// === Define the Subscriber Schema ===
// A schema defines the structure of documents stored in a MongoDB collection.
const subscriberSchema = new mongoose.Schema({
    name: String,      // Subscriber's name (String type)
    email: String,     // Subscriber's email address (String type)
    zipCode: Number    // Subscriber's postal/ZIP code (Number type)
});

// === Export the Model ===
// The model wraps the schema and provides an interface to interact with the "subscribers" collection in MongoDB.
// (Mongoose automatically pluralizes 'Subscriber' to 'subscribers' for the collection name.)
module.exports = mongoose.model("Subscriber", subscriberSchema);
