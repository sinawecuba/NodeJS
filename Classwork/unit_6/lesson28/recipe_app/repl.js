const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course");

// Variables to hold test documents
var testCourse, testSubscriber;

// =======================================
// Connect to MongoDB
// =======================================
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true } // Use new URL parser
);

// Ensure unique index creation is enabled
mongoose.set("useCreateIndex", true);
mongoose.Promise = global.Promise; // Use native Promises

// =======================================
// REMOVE ALL EXISTING DATA
// =======================================

// Remove all Subscriber documents
Subscriber.remove({})
  .then(items => console.log(`Removed ${items.n} subscriber records!`))
  // Remove all Course documents
  .then(() => {
    return Course.remove({});
  })
  .then(items => console.log(`Removed ${items.n} course records!`))
  // =======================================
  // CREATE A NEW SUBSCRIBER
  // =======================================
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
  // =======================================
  // FIND THE SUBSCRIBER BY NAME
  // =======================================
  .then(() => {
    return Subscriber.findOne({
      name: "Jon"
    });
  })
  .then(subscriber => {
    testSubscriber = subscriber; // Store in variable for later use
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  // =======================================
  // CREATE A NEW COURSE
  // =======================================
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
  // =======================================
  // ADD COURSE TO SUBSCRIBER'S COURSES ARRAY
  // =======================================
  .then(() => {
    testSubscriber.courses.push(testCourse); // Add course reference
    testSubscriber.save(); // Save updated subscriber
  })
  // =======================================
  // POPULATE COURSE DATA IN SUBSCRIBER
  // =======================================
  .then(() => {
    return Subscriber.populate(testSubscriber, "courses"); // Replace course IDs with full documents
  })
  .then(subscriber => console.log(subscriber)) // Log populated subscriber
  // =======================================
  // FIND ALL SUBSCRIBERS ENROLLED IN THE COURSE
  // =======================================
  .then(() => {
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id) // Find by ObjectId reference
    });
  })
  .then(subscriber => console.log(subscriber)); // Log subscribers enrolled in the course
