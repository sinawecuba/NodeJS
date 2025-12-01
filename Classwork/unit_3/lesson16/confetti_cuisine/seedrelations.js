"use strict";

// Import Mongoose and models
const mongoose = require("mongoose"),
    Course = require("./models/course"),         // Course model
    User = require("./models/user"),             // User model
    Subscriber = require("./models/subscriber"); // Subscriber model

// === Connect to MongoDB ===
mongoose.connect("mongodb://127.0.0.1:27017/confetti_cuisine", {
    useNewUrlParser: true,       // Parse connection string correctly
    useUnifiedTopology: true     // Use new topology engine
});
mongoose.Promise = global.Promise; // Use native promises

// Variables to store created documents for linking
let testCourse;
let testUser;
let testSubscriber;

// === Seed the database ===
// 1. Delete all existing courses
Course.deleteMany()
    .then(() => {
        // 2. Create a new course
        return Course.create({
            title: "Vegetarian Dishes",
            description: "A course on healthy vegetarian meals",
            items: ["Salad", "Stir-fry", "Smoothies"]
        });
    })
    .then(course => {
        testCourse = course; // Save reference to the created course
        console.log("\n✅ Course created:", testCourse.title);

        // 3. Create a new user
        return User.create({
            name: { first: "James", last: "Oliveira" },
            email: "james@example.com",
            zipCode: 1900
        });
    })
    .then(user => {
        testUser = user;           // Save reference to the created user
        testUser.courses.push(testCourse); // Link the course to the user's courses array
        return testUser.save();    // Save the updated user document
    })
    .then(() => {
        console.log("\n✅ User linked to course!");

        // 4. Create a subscriber linked to the user account
        return Subscriber.create({
            name: `${testUser.name.first} ${testUser.name.last}`, // Subscriber's name
            email: testUser.email,                                // Subscriber's email
            zipCode: testUser.zipCode,                            // Subscriber's ZIP code
            userAccount: testUser                                 // Reference to the user
        });
    })
    .then(subscriber => {
        testSubscriber = subscriber; // Save reference to the created subscriber
        console.log("\n✅ Subscriber linked to user account!");

        // 5. Populate the userAccount field for the subscriber
        return Subscriber.populate(testSubscriber, "userAccount");
    })
    .then(subscriber => {
        console.log("\n🔗 Linked subscriber:", subscriber); // Log populated subscriber
        mongoose.connection.close(); // Close the database connection
    })
    .catch(error => {
        console.error("⚠️ Error seeding database:", error); // Handle any errors
    });
