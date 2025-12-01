// Import the Express framework
const express = require("express");

// Create an Express application instance
const app = express();

// Import controller functions from the homeController file
const homeController = require("./controllers/homeController");

// Import express-ejs-layouts for managing EJS templates with layouts
const layouts = require("express-ejs-layouts");

// Set the server port (use environment variable if available, otherwise default to 3000)
app.set("port", process.env.PORT || 3000);

// Set EJS as the view engine for rendering templates
app.set("view engine", "ejs");

// Use the EJS layouts middleware to support layout templates
app.use(layouts);

// Middleware to parse URL-encoded data (form submissions)
// 'extended: false' means only simple key-value pairs (no nested objects)
app.use(
  express.urlencoded({
    extended: false
  })
);

// Middleware to parse incoming JSON data (from APIs or JSON requests)
app.use(express.json());

// Custom middleware that logs every incoming request’s URL to the console
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

// Route to handle GET requests with a dynamic 'vegetable' parameter
// Example: /items/carrot → displays "This is the page for carrot"
app.get("/items/:vegetable", homeController.sendReqParam);

// Route to handle POST requests to the root URL (/)
// Calls the sendPost function from homeController
app.post("/", homeController.sendPost);

// Route to handle GET requests with a dynamic 'myName' parameter
// Example: /name/James → renders index.ejs with firstName = "James"
app.get("/name/:myName", homeController.respondWithName);

// Start the server and listen on the defined port
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
