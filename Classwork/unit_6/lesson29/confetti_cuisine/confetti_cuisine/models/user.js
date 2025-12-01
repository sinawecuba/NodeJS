"use strict"; // Enforces strict mode for safer and cleaner JavaScript execution

// === Import Dependencies ===
const Subscriber = require("./subscriber"); // Import Subscriber model
const mongoose = require("mongoose"); // Imports Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracts Schema constructor from Mongoose
const passportLocalMongoose = require("passport-local-mongoose"); // Adds authentication helpers to the schema

// === Define User Schema ===
const userSchema = new Schema(
  {
    name: { // Defines the user's name as an embedded object
      first: { type: String, trim: true }, // First name with whitespace trimmed
      last: { type: String, trim: true } // Last name with whitespace trimmed
    },
    email: { type: String, required: true, unique: true }, // Required and unique email for each user
    zipCode: { 
      type: Number, 
      min: [10000, "Zip code too short"], // Ensures a minimum 5-digit zip code
      max: 99999 // Ensures zip code is not longer than 5 digits
    },
    courses: [
      { 
        type: Schema.Types.ObjectId, // References a Course document by its ID
        ref: "Course" // Establishes a relationship with the Course model
      }
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// === Virtual Property ===
// Adds a computed property to return the user's full name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`; // Concatenates first and last name
});

// === Pre-save Hook ===
// Runs before saving a user document to connect to a Subscriber account if one exists
userSchema.pre("save", function(next) {
  let user = this; // Reference to the current user instance
  if (user.subscribedAccount === undefined) { // Check if subscribedAccount is not set
    Subscriber.findOne({ email: user.email }) // Search for a subscriber with the same email
      .then(subscriber => {
        user.subscribedAccount = subscriber; // Link subscriber account to user
        next(); // Continue saving
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`); // Log error if query fails
        next(error); // Pass error to the next middleware
      });
  } else {
    next(); // Skip if already linked
  }
});

// === Passport Authentication Plugin ===
// Adds username, password hashing, and authentication methods to the schema
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Uses email instead of username for login
});

// === Export User Model ===
// Exports the schema as a Mongoose model named "User"
module.exports = mongoose.model("User", userSchema);
