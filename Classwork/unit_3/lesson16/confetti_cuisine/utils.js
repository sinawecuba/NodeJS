// utils.js
// Utility module for reading files and sending HTTP responses

const fs = require("fs");                      // File system module to read files
const httpStatus = require("http-status-codes"); // Provides standard HTTP status codes
const contentTypes = require("./contentTypes");  // Module defining content-type headers

module.exports = {
  // Function to read a file and send it as a response
  getFile: (file, res) => {
    fs.readFile(`./${file}`, (error, data) => { // Read the specified file
      if (error) {
        // If there is an error reading the file, send 500 Internal Server Error
        res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
        return res.end("There was an error serving content!"); // User-friendly message
      }
      // If successful, send the file contents in the response
      res.end(data);
    });
  }
};
