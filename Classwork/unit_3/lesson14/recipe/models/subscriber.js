// Import Mongoose library to work with MongoDB
const mongoose = require('mongoose');

// Create a schema for subscribers
const subscriberSchema = mongoose.Schema({
    // Define schema properties (fields) and their data types
    name: String,      // Subscriber's name (string)
    email: String,     // Subscriber's email address (string)
    zipCode: Number    // Subscriber's ZIP code (number)
});

// Export the schema as a Mongoose model named "Subscriber"
// This allows you to interact with the "subscribers" collection in MongoDB
module.exports = mongoose.model("Subscriber", subscriberSchema);
