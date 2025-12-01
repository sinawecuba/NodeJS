"use strict"; // Enforces strict mode for safer, cleaner JavaScript

// === Import Dependencies ===
const mongoose = require("mongoose"),               // Library for interacting with MongoDB
    Subscriber = require("./models/subscriber");    // Import the Subscriber model

// === Connect to MongoDB ===
// Establish a connection to the local "confetti_cuisine" database.
mongoose.connect("mongodb://127.0.0.1:27017/confetti_cuisine", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set Mongoose to use global Promises (to avoid deprecation warnings)
mongoose.Promise = global.Promise;

// === Sample Subscriber Data ===
// This array holds the initial data that will be inserted into the database.
const subscribers = [
    { name: "John Doe", email: "john@example.com", zipCode: 12345 },
    { name: "Jane Smith", email: "jane@example.com", zipCode: 67890 }
];

// === Database Seeding Process ===
// 1. Delete all existing subscriber records
// 2. Insert (create) new subscribers from the array above
// 3. Log the inserted documents
// 4. Close the database connection
Subscriber.deleteMany()  // Step 1: Remove all documents from the 'subscribers' collection
    .then(() => {
        // Step 2: Create new documents based on the sample array
        return Promise.all(subscribers.map(s => Subscriber.create(s)));
    })
    .then(results => {
        // Step 3: Confirm successful insertion and show the created records
        console.log("■ Database seeded successfully:", results);
        // Step 4: Close the MongoDB connection
        mongoose.connection.close();
    })
    .catch(error => {
        // Catch and log any errors during the process
        console.error("❌ Error seeding the database:", error);
    });
