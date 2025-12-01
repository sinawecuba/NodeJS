"use strict"; // Enforces strict mode for safer, cleaner JavaScript

// === Import Dependencies and Models ===
const mongoose = require("mongoose"),           // MongoDB ODM (Object Data Modeling) library
    Course = require("./models/course"),        // Import Course model
    User = require("./models/user"),            // Import User model
    Subscriber = require("./models/subscriber");// Import Subscriber model

// === Connect to MongoDB Database ===
mongoose.connect("mongodb://127.0.0.1:27017/confetti_cuisine", {
    useNewUrlParser: true,      // Use new URL parser to avoid deprecation warnings
    useUnifiedTopology: true    // Use new topology engine
});

// Use global Promises to avoid deprecation warnings
mongoose.Promise = global.Promise;

// === Declare Variables for Test Data ===
// These will hold created documents to allow relationships between them.
let testCourse;
let testUser;
let testSubscriber;

// === Step 1: Remove All Courses ===
// Clear any existing Course documents to start with a clean database state.
Course.deleteMany()
    // === Step 2: Create a New Course ===
    .then(() => {
        return Course.create({
            title: "Vegetarian Dishes",
            description: "A course on healthy vegetarian meals",
            items: ["Salad", "Stir-fry", "Smoothies"]
        });
    })
    // === Step 3: Log and Store the Created Course ===
    .then(course => {
        testCourse = course; // Store the created course for linking later
        console.log("■ Course created:", testCourse.title);

        // === Step 4: Create a New User ===
        // This user will later be linked to the created course.
        return User.create({
            name: { first: "Lethabo", last: "Mosoathupa" },
            email: "lethabo@example.com",
            zipCode: 1900
        });
    })
    // === Step 5: Link the User to the Course ===
    .then(user => {
        testUser = user;
        // Add the created course to the user's 'courses' array
        testUser.courses.push(testCourse);
        // Save the updated user document
        return testUser.save();
    })
    // === Step 6: Confirm User-Course Relationship ===
    .then(() => {
        console.log("■ User linked to course!");

        // === Step 7: Create a Subscriber Linked to the User ===
        return Subscriber.create({
            name: `${testUser.name.first} ${testUser.name.last}`,
            email: testUser.email,
            zipCode: testUser.zipCode,
            userAccount: testUser // Reference to the User document
        });
    })
    // === Step 8: Confirm Subscriber Creation ===
    .then(subscriber => {
        testSubscriber = subscriber;
        console.log("■ Subscriber linked to user account!");

        // === Step 9: Populate User Reference in Subscriber ===
        // Replace the userAccount ID with full user document data
        return Subscriber.populate(testSubscriber, "userAccount");
    })
    // === Step 10: Log the Final Linked Subscriber ===
    .then(subscriber => {
        console.log("■ Linked subscriber:", subscriber);
        // Close the MongoDB connection after all operations
        mongoose.connection.close();
    })
    // === Error Handling ===
    .catch(error => {
        console.log("❌ Error during database seeding:", error);
    });
