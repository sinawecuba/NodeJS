// contentTypes.js
// This module defines common Content-Type headers for HTTP responses
// It helps the server tell the browser what kind of content is being sent

module.exports = {
  html: { "Content-Type": "text/html" },       // HTML content
  text: { "Content-Type": "text/plain" },      // Plain text content
  js:   { "Content-Type": "text/javascript" }, // JavaScript content
  jpg:  { "Content-Type": "image/jpg" },       // JPEG image content
  png:  { "Content-Type": "image/png" },       // PNG image content
  css:  { "Content-Type": "text/css" }         // CSS stylesheet content
};
