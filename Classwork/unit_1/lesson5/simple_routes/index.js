"use strict"; // Enforce strict mode to help catch coding errors and enforce safer JavaScript practices

// A simple route-to-response mapping object.
// Each key represents a route (URL path) and the value is the HTML response to send.
const routeResponseMap = {
  "/info": "<h1>Info Page</h1>",
  "/contact": "<h1>Contact Us</h1>",
  "/about": "<h1>Learn More About Us.</h1>",
  "/hello": '<h1>Say hello by emailing us <a href="https://mail.google.com/">here</a></h1>',
  "/error": "<h1>Sorry, the page you are looking for is not here.</h1>"
};

// Define the port number the server will listen on
const port = 3000;

// Import the built-in Node.js HTTP module and the http-status-codes library
const http = require("http");
const httpStatus = require("http-status-codes");

// Create the HTTP server and define how it should respond to incoming requests
const app = http.createServer((req, res) => {
  // Always send an HTTP 200 (OK) response header with content type set to HTML
  res.writeHead(httpStatus.OK, {
    "Content-Type": "text/html"
  });

  // Check if the requested URL path exists in the routeResponseMap object
  if (routeResponseMap[req.url]) {
    // Simulate a 2-second delay before sending the response
    setTimeout(() => {
      res.end(routeResponseMap[req.url]); // Send the matching HTML response
    }, 2000);
  } else {
    // If the path is not found, send a default "Welcome" page
    res.end("<h1>Welcome!</h1>");
  }
});

// Start the server and listen for incoming requests on the defined port
app.listen(port);

// Log a message to confirm the server is running
console.log(`The server has started and is listening on port number: ${port}`);