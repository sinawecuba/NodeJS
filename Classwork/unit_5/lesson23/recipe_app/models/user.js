"use strict"; // Enable strict mode to help catch common coding errors

// Import bcrypt for password hashing and comparison
const bcrypt = require("bcrypt");

// Import mongoose for MongoDB schema and model creation
const mongoose = require("mongoose"),
  { Schema } = mongoose, // Destructure Schema for cleaner syntax
  Subscriber = require("./subscriber"), // Import Subscriber model for linking accounts

  /**
   * Define the User schema — structure for user documents in MongoDB.
   * Each field includes type definitions and validation rules.
   */
  userSchema = new Schema(
    {
      // User's name, stored as a nested object with first and last properties
      name: {
        first: {
          type: String,
          trim: true // Removes extra spaces from both ends
        },
        last: {
          type: String,
          trim: true
        }
      },

      // User's email — must be unique, lowercase, and required
      email: {
        type: String,
        required: true,
        lowercase: true, // Automatically converts email to lowercase
        unique: true     // Prevents duplicate email registrations
      },

      // Optional postal/zip code with min and max validation
      zipCode: {
        type: Number,
        min: [1000, "Zip code too short"], // Validation: must be at least 4 digits
        max: 99999                         // Validation: cannot exceed 5 digits
      },

      // User's hashed password (will be encrypted before saving)
      password: {
        type: String,
        required: true
      },

      // Array of ObjectIds referencing the "Course" model
      // Represents courses the user is enrolled in
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],

      // Reference to a related Subscriber account, if any
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber"
      }
    },
    {
      // Automatically adds createdAt and updatedAt timestamps
      timestamps: true
    }
  );



/**
 * Virtual property: fullName
 * Combines the user's first and last names into one string.
 * Does not exist in the database — it's computed dynamically when accessed.
 */
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});



/**
 * Pre-save middleware: Automatically link a User to an existing Subscriber.
 * Before saving, this checks if a Subscriber with the same email exists
 * and associates the user's subscribedAccount field with it.
 */
userSchema.pre("save", function(next) {
  let user = this;

  // Only try to link if subscribedAccount is not already set
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then(subscriber => {
        user.subscribedAccount = subscriber; // Link the found subscriber
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next(); // Continue if already linked
  }
});



/**
 * Pre-save middleware: Hash the user's password before saving to the database.
 * Ensures that plaintext passwords are never stored directly.
 */
userSchema.pre("save", function(next) {
  let user = this;

  // Hash the password with bcrypt using a salt round of 10
  bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash; // Replace plaintext password with hash
      next();
    })
    .catch(error => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});



/**
 * Instance method: passwordComparison()
 * Compares a provided password with the hashed password stored in the database.
 * Returns a Promise that resolves to true (match) or false (no match).
 */
userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};



// Export the User model, creating a "users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
