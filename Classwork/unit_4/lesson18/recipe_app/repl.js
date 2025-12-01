"use strict";

// === IMPORT REQUIRED MODULES ===
const mongoose = require("mongoose");              // Mongoose for connecting to MongoDB
const Subscriber = require("./models/subscriber"); // Import Subscriber model
const User = require("./models/user");             // Import User model


// === CONNECT TO MONGODB DATABASE ===
// Connects to a local MongoDB instance running on port 27017
// Database name: recipe_db
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db", {
    useNewUrlParser: true,
});

// Set Mongoose to use native JavaScript promises
mongoose.Promise = global.Promise;


// === STEP 1: CREATE A NEW SUBSCRIBER ===
// This creates a new record in the "subscribers" collection
Subscriber.create({
    name: "Test User",                  // Subscriber’s full name
    email: "testUser7@gmail.com",       // Subscriber’s email
    zipCode: "12345"                    // Subscriber’s postal code
})
    .then(subscriber => console.log(`✅ Subscriber created: ${subscriber}`)) // Logs success
    .catch(error => console.log(`❌ Error creating subscriber: ${error.message}`)); // Logs any errors


// === STEP 2: CREATE A NEW USER ===
// Declare a variable to store the user so we can modify it later
let testUser;

// Create a user record that matches the subscriber by email
User.create({
    name: {
        first: "Test",   // First name
        last: "User"     // Last name
    },
    email: "testUser7@gmail.com", // Must match the subscriber’s email to link them
    password: "testing",          // Example password (would be hashed in production)
})
    .then((user) => {
        testUser = user; // Store the newly created user object
        console.log(`✅ User created: ${user.fullName}`);
        
        // === STEP 3: FIND A SUBSCRIBER WITH THE SAME EMAIL ===
        // The idea is to link the user to their subscriber record
        return Subscriber.findOne({
            email: testUser.email, // Look for subscriber by email
        });
    })
    .then((subscriber) => {
        if (subscriber) {
            // === STEP 4: LINK THE USER TO THE SUBSCRIBER ===
            // Use the subscriber’s MongoDB _id to create a relationship
            testUser.subscribedAccount = subscriber._id;

            // Save the updated user document to the database
            return testUser.save();
        } else {
            // If no subscriber was found for that email
            throw new Error('❌ Subscriber not found for this email');
        }
    })
    .then((updatedUser) => {
        // === STEP 5: CONFIRM SUCCESS ===
        // After saving, log confirmation that the user is linked
        console.log(`✅ Updated User (linked to subscriber): ${updatedUser}`);
        console.log("🎉 USER SUCCESSFULLY LINKED TO SUBSCRIBER!");
    })
    .catch((error) => console.log(`❌ Error: ${error.message}`));
