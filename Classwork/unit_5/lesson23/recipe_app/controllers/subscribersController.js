"use strict"; // Enable strict mode to help catch common coding errors and enforce best practices

// Import the Subscriber model for interacting with the subscribers collection in MongoDB
const Subscriber = require("../models/subscriber");

// Export an object containing controller methods for managing subscribers
module.exports = {
  /**
   * Fetch all subscribers from the database.
   * The results are stored in res.locals for use by subsequent middleware or view rendering.
   */
  index: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers; // Store retrieved subscribers for later use
        next(); // Move to the next middleware or route handler
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`); // Log any errors
        next(error); // Pass the error to the next middleware for handling
      });
  },

  /**
   * Render the subscribers index page using the data fetched by the `index` method.
   */
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render the "subscribers/index" view
  },

  /**
   * Save a new subscriber to the database using form data from the request body.
   * Renders a "thanks" page on success, or sends the error on failure.
   */
  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    newSubscriber
      .save()
      .then(result => {
        res.render("thanks"); // Render a thank-you page after successful save
      })
      .catch(error => {
        if (error) res.send(error); // Send error message if saving fails
      });
  },

  /**
   * Render the form for creating a new subscriber.
   */
  new: (req, res) => {
    res.render("subscribers/new"); // Render the "new subscriber" form
  },

  /**
   * Create a new subscriber record in the database using form input.
   * On success, set redirect and subscriber data in res.locals for further processing.
   */
  create: (req, res, next) => {
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };

    Subscriber.create(subscriberParams)
      .then(subscriber => {
        res.locals.redirect = "/subscribers"; // Redirect to subscribers list
        res.locals.subscriber = subscriber; // Store the created subscriber
        next(); // Continue to redirect middleware
      })
      .catch(error => {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error);
      });
  },

  /**
   * Find and display a single subscriber based on their ID from the route parameter.
   * Store the subscriber in res.locals for use by the showView method.
   */
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.locals.subscriber = subscriber; // Save subscriber data for rendering
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Render the page that shows the details of a single subscriber.
   */
  showView: (req, res) => {
    res.render("subscribers/show"); // Render the "show subscriber" view
  },

  /**
   * Render the edit form for an existing subscriber.
   * Fetches the subscriber data by ID and pre-fills the form fields.
   */
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", {
          subscriber: subscriber // Pass subscriber data to the view
        });
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Update an existing subscriber’s information in the database.
   * Uses form data to modify the record and then redirects to the subscriber’s page.
   */
  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
      };

    Subscriber.findByIdAndUpdate(subscriberId, {
      $set: subscriberParams
    })
      .then(subscriber => {
        res.locals.redirect = `/subscribers/${subscriberId}`; // Redirect to the updated subscriber’s page
        res.locals.subscriber = subscriber; // Store updated subscriber data
        next();
      })
      .catch(error => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Delete a subscriber record from the database using their ID.
   * Redirects back to the list of subscribers after deletion.
   */
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers"; // Redirect to subscriber list
        next();
      })
      .catch(error => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next();
      });
  },

  /**
   * Handle redirects based on res.locals.redirect.
   * If a redirect path exists, redirect the response; otherwise, continue to the next middleware.
   */
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
