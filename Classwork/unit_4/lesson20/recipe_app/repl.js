const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const User = require("./models/user");

// === Connect to MongoDB ===
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db", {
    useNewUrlParser: true,
});
mongoose.Promise = global.Promise; // Use native promises

// === Create a new Subscriber ===
Subscriber.create({
    name: "Test User",
    email: "testUser7@gmail.com",
    zipCode: "12345"
})
    .then(subscriber => {
        // Log the created subscriber
        console.log(`Subscriber: ${subscriber}`);
    })
    .catch(error => console.log(error.message)); // Handle any errors

// === Create a new User and link to Subscriber ===
let testUser; // Variable to store the newly created user

User.create({
    name: {
        first: "Test",
        last: "User",
    },
    email: "testUser7@gmail.com",
    password: "testing",
})
    .then((user) => {
        testUser = user; // Store the created user
        // Find the Subscriber associated with the user's email
        return Subscriber.findOne({
            email: testUser.email,
        });
    })
    .then((subscriber) => {
        if (subscriber) {
            // Link the subscriber's ID to the user
            testUser.subscribedAccount = subscriber._id;
            // Save the updated user
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
    .catch((error) => console.log(error.message)); // Handle errors
