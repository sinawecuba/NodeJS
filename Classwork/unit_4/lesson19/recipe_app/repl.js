"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT MODULES ===
const mongoose = require("mongoose");         // Mongoose ODM for MongoDB
const Subscriber = require("./models/subscriber"); // Subscriber model
const User = require("./models/user");             // User model

// === CONNECT TO MONGODB ===
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db", {
    useNewUrlParser: true, // Use new URL parser
});
mongoose.Promise = global.Promise; // Use native Promises

// === CREATE A SUBSCRIBER ===
Subscriber.create({
    name: "Test User",
    email: "testUser7@gmail.com",
    zipCode: "12345"
})
    .then(subscriber => console.log(`Subscriber: ${subscriber}`)) // Log the created subscriber
    .catch(error => console.log(error.message)); // Handle errors

// === CREATE A USER AND LINK TO SUBSCRIBER ===
let testUser; // Variable to hold the newly created user

User.create({
    name: {
        first: "Test",
        last: "User",
    },
    email: "testUser7@gmail.com", // Same email as subscriber for linking
    password: "testing",
})
    .then((user) => {
        testUser = user; // Store the created user
        // Find the corresponding subscriber by email
        return Subscriber.findOne({
            email: testUser.email,
        });
    })
    .then((subscriber) => {
        if (subscriber) {
            // Link the subscriber to the user
            testUser.subscribedAccount = subscriber._id;
            // Save the updated user document
            return testUser.save();
        } else {
            // Throw an error if subscriber not found
            throw new Error('Subscriber not found');
        }
    })
    .then((updatedUser) => {
        // Log the successfully updated user
        console.log(`Updated User: ${updatedUser}`);
        console.log("USER UPDATED!");
    })
    .catch((error) => console.log(error.message)); // Handle all errors
