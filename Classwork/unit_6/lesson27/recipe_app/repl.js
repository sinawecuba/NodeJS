const mongoose = require("mongoose"), // MongoDB ODM
  Subscriber = require("./models/subscriber"), // Subscriber model
  Course = require("./models/course"); // Course model

var testCourse, testSubscriber; // Variables to hold created documents for testing

// ----------------------------
// DATABASE CONNECTION
// ----------------------------
mongoose.connect(
  "mongodb://localhost:27017/recipe_db", // Connect to local MongoDB database
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true); // Avoid deprecation warning for unique indexes
mongoose.Promise = global.Promise; // Use native promises

// ----------------------------
// REMOVE EXISTING DATA
// ----------------------------
Subscriber.remove({}) // Remove all subscribers
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return Course.remove({}); // Remove all courses
  })
  .then(items => console.log(`Removed ${items.n} records!`))

  // ----------------------------
  // CREATE A TEST SUBSCRIBER
  // ----------------------------
  .then(() => {
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: "12345"
    });
  })
  .then(subscriber => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })

  // ----------------------------
  // FIND THE SUBSCRIBER AGAIN
  // ----------------------------
  .then(() => {
    return Subscriber.findOne({
      name: "Jon"
    });
  })
  .then(subscriber => {
    testSubscriber = subscriber; // Store in variable for later use
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })

  // ----------------------------
  // CREATE A TEST COURSE
  // ----------------------------
  .then(() => {
    return Course.create({
      title: "Tomato Land",
      description: "Locally farmed tomatoes only",
      zipCode: 12345,
      items: ["cherry", "heirloom"]
    });
  })
  .then(course => {
    testCourse = course; // Store in variable for later use
    console.log(`Created course: ${course.title}`);
  })

  // ----------------------------
  // ASSOCIATE SUBSCRIBER WITH COURSE
  // ----------------------------
  .then(() => {
    testSubscriber.courses.push(testCourse); // Add course to subscriber's courses array
    testSubscriber.save(); // Save updated subscriber
  })

  // ----------------------------
  // POPULATE COURSES IN SUBSCRIBER
  // ----------------------------
  .then(() => {
    return Subscriber.populate(testSubscriber, "courses"); // Replace course IDs with actual course documents
  })
  .then(subscriber => console.log(subscriber)) // Log populated subscriber

  // ----------------------------
  // FIND SUBSCRIBERS BY COURSE
  // ----------------------------
  .then(() => {
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id) // Find subscribers who have this course
    });
  })
  .then(subscriber => console.log(subscriber)); // Log subscribers enrolled in the course
