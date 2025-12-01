"use strict"; // Enforces strict mode to catch common coding mistakes and enforce best practices

const mongoose = require("mongoose"), // Import Mongoose library for MongoDB interactions
  { Schema } = mongoose,              // Extract the Schema class for easier use
  // === DEFINE USER SCHEMA ===
  // The schema defines how "User" documents are structured in MongoDB
  userSchema = new Schema(
    {
      // === USER NAME ===
      // Name is an object with separate fields for first and last names
      name: {
        first: {
          type: String, // Data type: String
          trim: true    // Removes extra spaces from start and end
        },
        last: {
          type: String, // Data type: String
          trim: true    // Ensures clean formatting
        }
      },

      // === EMAIL ===
      // Unique email for each user
      email: {
        type: String,     // Data type: String
        required: true,   // Validation: must be provided
        lowercase: true,  // Automatically converts to lowercase before saving
        unique: true      // Ensures no duplicate emails exist
      },

      // === ZIP CODE ===
      // Optional zip/postal code with value limits
      zipCode: {
        type: Number,                        // Data type: Number
        min: [1000, "Zip code too short"],   // Minimum 4 digits
        max: 99999                           // Maximum 5 digits
      },

      // === PASSWORD ===
      // User’s password (should be hashed before saving)
      password: {
        type: String,     // Data type: String
        required: true    // Validation: must be provided
      },

      // === COURSES ===
      // Array of ObjectIds referencing "Course" documents
      courses: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Course" // Reference to the Course model
      }],

      // === SUBSCRIBED ACCOUNT ===
      // Links the user to a corresponding "Subscriber" document
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber" // Reference to the Subscriber model
      }
    },
    {
      // Automatically adds createdAt and updatedAt timestamps
      timestamps: true
    }
  );

// === VIRTUAL PROPERTY: fullName ===
// Purpose: Combines first and last names into one property when accessed
// Example: user.fullName -> "John Doe"
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// === EXPORT MODEL ===
// Converts the schema into a model named "User"
// Allows you to interact with the "users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
