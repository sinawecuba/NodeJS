"use strict";

// Import Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define a schema for Subscriber documents
const subscriberSchema = new mongoose.Schema({
    name: String,               // Subscriber's name (string)
    email: String,              // Subscriber's email address (string)
    zipCode: Number,            // Subscriber's ZIP code (number)
    userAccount: {              // Reference to a related User document
        type: mongoose.Schema.Types.ObjectId, // Store the ObjectId of a User document
        ref: "User"             // Reference the "User" model for population
    }
});

// Export the schema as a Mongoose model named "Subscriber"
// This allows interaction with the "subscribers" collection in MongoDB
module.exports = mongoose.model("Subscriber", subscriberSchema);
