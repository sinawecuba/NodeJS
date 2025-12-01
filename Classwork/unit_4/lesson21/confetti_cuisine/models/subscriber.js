// Import mongoose to work with MongoDB
const mongoose = require('mongoose');

// === Define the schema for the Subscriber collection ===
const subscriberSchema = mongoose.Schema({
    // Name of the subscriber (string)
    name: String,
    // Email of the subscriber (string)
    email: String,
    // Zip code of the subscriber (number)
    zipCode: Number
});

// Export the model so it can be used elsewhere in the app
// The first argument "Subscriber" is the name of the collection
// Mongoose will automatically create a "subscribers" collection in the DB
module.exports = mongoose.model("Subscriber", subscriberSchema);
