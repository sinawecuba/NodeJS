// contentTypes.js
// This module exports a set of common Content-Type headers
// used when sending responses from an HTTP server.

// Export an object where each key is a file type and the value
// is an object specifying the correct Content-Type header.
module.exports = {
  html: { "Content-Type": "text/html" },         // HTML files
  text: { "Content-Type": "text/plain" },        // Plain text files
  js:   { "Content-Type": "text/javascript" },   // JavaScript files
  jpg:  { "Content-Type": "image/jpg" },         // JPEG image files
  png:  { "Content-Type": "image/png" },         // PNG image files
  css:  { "Content-Type": "text/css" }           // CSS stylesheets
};

// Usage Example:
// const contentTypes = require('./contentTypes');
// res.writeHead(200, contentTypes.html);
// res.end("<h1>Hello World</h1>");
