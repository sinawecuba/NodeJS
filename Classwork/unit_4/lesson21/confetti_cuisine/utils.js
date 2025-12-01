// utils.js
"use strict";

// === Import Dependencies ===
const fs = require("fs");                     // Node.js file system module to read files
const httpStatus = require("http-status-codes"); // Standard HTTP status codes
const contentTypes = require("./contentTypes");  // Map of content types (e.g., HTML, CSS, JS)

// === Export Utility Methods ===
module.exports = {
  // getFile: Reads a file from disk and sends it in the HTTP response
  getFile: (file, res) => {
    // Read the file asynchronously
    fs.readFile(`./${file}`, (error, data) => {
      if (error) {
        // If an error occurs (e.g., file not found), respond with 500 Internal Server Error
        res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
        return res.end("There was an error serving content!");
      }
      // If file read is successful, send the file contents in the response
      res.end(data);
    });
  }
};
