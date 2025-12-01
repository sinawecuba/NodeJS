// main.js

// Import required modules
const http = require("http");                     // Node.js built-in module for creating an HTTP server
const httpStatus = require("http-status-codes");  // Provides easy-to-read constants for HTTP status codes
const router = require("./router");               // Custom router module to handle routes (GET and POST)
const contentTypes = require("./contentTypes");   // Object defining MIME types (e.g., text/html, text/css, etc.)
const utils = require("./utils");                 // Utility functions (like reading and sending files)

const port = 3000; // The port number the server will listen on

/* ==============================
   PAGE ROUTES (HTML Views)
   ============================== */

// Route for the homepage
router.get("/", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.html);       // Send 200 OK and specify HTML content
    utils.getFile("views/index.html", res);                // Serve the index.html file
});

// Route for the courses page
router.get("/courses.html", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.html);       // HTML response header
    utils.getFile("views/courses.html", res);              // Serve courses.html from the views folder
});

// Route for the contact page
router.get("/contact.html", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.html);       // HTML response header
    utils.getFile("views/contact.html", res);              // Serve contact.html from the views folder
});

/* ==================================================
   FORM SUBMISSION ROUTE (POST)
   ================================================== */

// Handles form submissions (simple version, no body parsing yet)
router.post("/", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.html);       // Return HTML response
    utils.getFile("views/thanks.html", res);               // Serve the "thank you" page after form submission
});

/* ==================================================
   STATIC ASSETS (CSS, JS, IMAGES)
   ================================================== */

// Serve Bootstrap CSS
router.get("/bootstrap.css", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.css);
    utils.getFile("public/css/bootstrap.css", res);
});

// Serve custom CSS file
router.get("/confetti_cuisine.css", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.css);
    utils.getFile("public/css/confetti_cuisine.css", res);
});

// Serve custom JavaScript file
router.get("/confettiCuisine.js", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.js);
    utils.getFile("public/js/confettiCuisine.js", res);
});

// Serve product image
router.get("/product.jpg", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.jpg);
    utils.getFile("public/images/product.jpg", res);
});

// Serve people image
router.get("/people.jpg", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.jpg);
    utils.getFile("public/images/people.jpg", res);
});

// Serve graph image
router.get("/graph.png", (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.png);
    utils.getFile("public/images/graph.png", res);
});

/* ==============================
   START THE SERVER
   ============================== */

// Create an HTTP server using the router to handle requests
http.createServer(router.handle).listen(port);

// Log a confirmation message to the console
console.log(`Server listening on port ${port}`);
