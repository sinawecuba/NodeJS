"use strict";
// Enables strict mode — helps catch common coding mistakes and enforces better coding practices.

const port = 3000;
// Defines the port number (3000) that the server will listen on for incoming requests.

const http = require("http");
// Imports Node.js's built-in 'http' module, which allows us to create an HTTP server.

const httpStatus = require("http-status-codes");
// Imports the 'http-status-codes' module, which provides named constants for HTTP status codes (like 200 for OK).

const app = http.createServer((request, response) => {
    // Creates an HTTP server that handles incoming requests and sends responses.
    
    console.log("Received an incoming request!");
    // Logs a message to the console whenever a request is received.

    response.writeHead(httpStatus.OK, {
        "Content-Type": "text/html" // Sets the HTTP header to indicate that the response is HTML.
    });
    // Sends a response header with status code 200 (OK) and specifies that the content type is HTML.

    let responseMessage = "<h1>Hello, Universe, Are you ready!</h1>";
    // Defines the HTML message that will be sent back to the client.

    response.write(responseMessage);
    // Sends the HTML message as part of the HTTP response body.

    response.end();
    // Signals that the response is complete and no more data will be sent.

    console.log(`Sent a response : ${responseMessage}`);
    // Logs the response message to the console for debugging.
});

app.listen(port);
// Tells the server to start listening for requests on the defined port (3000).

console.log(`The server has started and is listening on port number: ${port}`);
// Logs a confirmation message indicating that the server is up and running.
