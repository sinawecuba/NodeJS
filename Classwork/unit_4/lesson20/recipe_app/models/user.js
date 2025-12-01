"use strict"; // Enforce strict mode for safer JavaScript

const mongoose = require("mongoose"),
  { Schema } = mongoose;

// Define schema for User collection
const userSchema = new Schema(
  {
    // Name object containing first and last name
    name: {
      first: {
        type: String,   // Data type: String
        trim: true      // Trim whitespace from the beginning and end
      },
      last: {
        type: String,
        trim: true
      }
    },
    // User email address
    email: {
      type: String,    // Data type: String
      required: true,  // Email is required
      lowercase: true, // Store email in lowercase
      unique: true     // Each email must be unique
    },
    // Zip code for the user
    zipCode: {
      type: Number,              // Data type: Number
      min: [1000, "Zip code too short"], // Minimum validation
      max: 99999                 // Maximum validation
    },
    // User password
    password: {
      type: String,
      required: true             // Password is required
    },
    // Courses the user is enrolled in
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    
    // Reference to the subscriber account associated with this user
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber"
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// Virtual property to get full name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Export the User model
module.exports = mongoose.model("User", userSchema);
