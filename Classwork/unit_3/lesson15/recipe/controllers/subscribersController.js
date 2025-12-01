"use strict"; // Enforces strict mode for cleaner and safer JavaScript

// Import the Subscriber model to interact with the MongoDB "subscribers" collection
const Subscriber = require("../models/subscriber");

// === Render the Contact / Subscription Page ===
// This controller renders the "contact.ejs" page,
// which contains the form for new users to subscribe.
exports.getSubscriptionPage = (req, res) => {
    res.render("contact"); // Display the contact form view
};

// === Save a New Subscriber ===
// This controller handles form submissions from the contact page.
// It creates a new Subscriber object using data from the request body,
// saves it to the MongoDB database, and then renders a thank-you page.
exports.saveSubscriber = (req, res) => {
    // Create a new subscriber document based on form input
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });

    // Save the subscriber to the database
    newSubscriber
        .save()
        .then(result => {
            console.log("■ Subscriber saved:", result); // Log success to console
            res.render("thanks"); // Render the thank-you page upon success
        })
        .catch(error => {
            console.error("■ Error saving subscriber:", error); // Log any errors
            res.send(error); // Send error details back to the client
        });
};

// === Display All Subscribers ===
// This controller queries the database for all subscribers
// and renders them on the "subscribers.ejs" page.
exports.getAllSubscribers = (req, res) => {
    Subscriber.find({}) // Retrieve all subscriber documents
        .exec() // Execute the query
        .then(subscribers => {
            // Render the subscribers list view and pass the retrieved data
            res.render("subscribers", { subscribers: subscribers });
        })
        .catch(error => {
            console.error(error.message); // Log any database query errors
            res.send(error); // Send the error response to the client
        });
};
