"use strict"; // enforce strict mode for safer, cleaner JavaScript execution

const Subscriber = require("../models/subscriber"); // import the Subscriber model from the models folder

// === Helper function to extract subscriber fields from request body ===
const getSubscriberParams = (body) => ({ // define a helper function that returns only valid subscriber fields
  name: body.name, // subscriber's name from form input
  email: body.email, // subscriber's email from form input
  zipCode: body.zipCode // subscriber's zip code from form input
}); // end of getSubscriberParams

// === Export all controller methods ===
module.exports = { // start exporting an object that contains all CRUD controller actions

  // === List all subscribers ===
  index: (req, res, next) => { // middleware to fetch all subscribers from the database
    Subscriber.find() // query MongoDB to find all subscriber documents
      .then((subscribers) => { // if successful, return an array of subscriber objects
        res.locals.subscribers = subscribers; // store the subscribers in res.locals for later middleware or views
        next(); // move on to the next middleware
      })
      .catch((error) => { // handle any error during the query
        console.log(`Error fetching subscribers: ${error.message}`); // log the error message for debugging
        next(error); // pass error to Express error-handling middleware
      });
  }, // end index

  // === Render index view for subscribers ===
  indexView: (req, res) => { // middleware to render a view showing all subscribers
    res.render("subscribers/index", { subscribers: res.locals.subscribers }); // render subscribers/index.ejs and pass the subscribers array
  }, // end indexView

  // === Render new subscriber form ===
  new: (req, res) => { // middleware to show a form for adding a new subscriber
    res.render("subscribers/new"); // render subscribers/new.ejs template
  }, // end new

  // === Create a new subscriber ===
  create: (req, res, next) => { // middleware to handle new subscriber form submission
    const subscriberParams = getSubscriberParams(req.body); // extract valid form fields using helper
    Subscriber.create(subscriberParams) // insert a new subscriber document into MongoDB
      .then((subscriber) => { // if successful, return the created subscriber
        req.flash("success", "Subscriber created successfully!"); // flash success message to user
        res.locals.redirect = "/subscribers"; // set redirect path to the subscribers list
        res.locals.subscriber = subscriber; // store the created subscriber in res.locals
        next(); // move on to redirectView middleware
      })
      .catch((error) => { // handle errors from MongoDB or validation
        console.log(`Error creating subscriber: ${error.message}`); // log the error message

        // === Handle duplicate email error ===
        if (error.code === 11000) { // MongoDB duplicate key error code
          req.flash("error", "Email address is already registered."); // inform user that email exists
        } else if (error.name === "ValidationError") { // handle Mongoose validation errors
          const messages = Object.values(error.errors).map(e => e.message); // extract all validation messages
          req.flash("error", messages.join(", ")); // flash all validation error messages
        } else { // handle any other kind of error
          req.flash("error", `Failed to create subscriber: ${error.message}`); // generic error message
        }

        res.locals.redirect = "/subscribers/new"; // redirect user back to the new subscriber form
        next(); // move to redirectView middleware
      });
  }, // end create

  // === Redirect helper ===
  redirectView: (req, res, next) => { // middleware that performs a redirect if res.locals.redirect is set
    const redirectPath = res.locals.redirect; // retrieve redirect path from res.locals
    if (redirectPath) res.redirect(redirectPath); // redirect to the specified path
    else next(); // if no redirect path, continue middleware chain
  }, // end redirectView

  // === Show a subscriber by ID ===
  show: (req, res, next) => { // middleware to display details of a single subscriber
    const subscriberId = req.params.id; // get subscriber id from URL parameters
    Subscriber.findById(subscriberId) // query database for that subscriber
      .then((subscriber) => { // if found, return subscriber document
        res.locals.subscriber = subscriber; // store found subscriber in res.locals
        next(); // move to showView middleware
      })
      .catch((error) => { // handle query errors
        console.log(`Error fetching subscriber by ID: ${error.message}`); // log error message
        next(error); // forward error to error handler
      });
  }, // end show

  // === Render single subscriber view ===
  showView: (req, res) => { // middleware to render page showing a single subscriber’s details
    res.render("subscribers/show", { subscriber: res.locals.subscriber }); // render subscribers/show.ejs with subscriber data
  }, // end showView

  // === Render edit form for a subscriber ===
  edit: (req, res, next) => { // middleware to display edit form for a specific subscriber
    const subscriberId = req.params.id; // get subscriber id from URL
    Subscriber.findById(subscriberId) // query database for the subscriber
      .then((subscriber) => { // if found, return subscriber document
        res.render("subscribers/edit", { subscriber }); // render subscribers/edit.ejs with the subscriber data
      })
      .catch((error) => { // handle errors while fetching subscriber
        console.log(`Error fetching subscriber for edit: ${error.message}`); // log error
        next(error); // forward error to handler
      });
  }, // end edit

  // === Update a subscriber ===
  update: (req, res, next) => { // middleware to update an existing subscriber
    const subscriberId = req.params.id; // get subscriber id from route params
    const subscriberParams = getSubscriberParams(req.body); // extract updated data from form

    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams }) // update subscriber document in MongoDB
      .then((subscriber) => { // if successful, return old subscriber document
        res.locals.redirect = `/subscribers/${subscriberId}`; // set redirect to show updated subscriber page
        res.locals.subscriber = subscriber; // store subscriber in res.locals
        next(); // move to redirectView middleware
      })
      .catch((error) => { // handle any update errors
        console.log(`Error updating subscriber: ${error.message}`); // log error
        next(error); // forward error
      });
  }, // end update

  // === Delete a subscriber ===
  delete: (req, res, next) => { // middleware to delete a subscriber by id
    const subscriberId = req.params.id; // get id from URL params
    Subscriber.findByIdAndRemove(subscriberId) // remove document with that id
      .then(() => { // if successful, proceed
        res.locals.redirect = "/subscribers"; // after deletion, redirect to subscribers list
        next(); // move to redirectView middleware
      })
      .catch((error) => { // handle deletion errors
        console.log(`Error deleting subscriber: ${error.message}`); // log error message
        next(); // still move on even if there’s an error
      });
  } // end delete
}; // end of module.exports
