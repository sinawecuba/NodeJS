// Import the Subscriber model to interact with the subscribers collection in MongoDB
const Subscriber = require('../models/subscriber');

// === Controller to get all subscribers ===
// Queries the database for all subscriber documents
// Then renders the "subscribers" view with the retrieved list
exports.getAllSubscribers = (req, res) => {
    Subscriber.find({})
        .exec() // Execute the query and return a promise
        .then((subscribers) => {
            // Render the subscribers view and pass the retrieved subscribers
            res.render("subscribers", {
                subscribers: subscribers
            });
        })
        .catch((error) => {
            // Log any errors and return an empty array
            console.log(error.message);
            return [];
        })
        .then(() => {
            // This runs after either the previous then or catch
            console.log("Promise Complete");
        });
};

// === Controller to render the subscription/contact page ===
exports.getSubscriptionPage = (req, res) => {
    // Render the contact form view
    res.render("contact");
};

// === Controller to save a new subscriber ===
// Receives data from a POST request and saves a new Subscriber document
exports.saveSubscriber = (req, res) => {
    // Create a new subscriber instance using form data
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });

    // Save the new subscriber to the database
    newSubscriber.save()
        .then((result) => {
            // Render a "thanks" page upon successful save
            res.render("thanks");
        })
        .catch((error) => {
            // If there is an error saving, send the error as response
            res.send(error);
        });
};
