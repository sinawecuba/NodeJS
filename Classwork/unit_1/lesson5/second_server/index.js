const port = 3000;
// Defines the port number (3000) on which the server will listen for incoming requests.

const http = require("http");
// Imports Node.js's built-in 'http' module to create and manage an HTTP server.

const httpStatus = require("http-status-codes");
// Imports the 'http-status-codes' module, which provides constants for standard HTTP status codes.

const app = http.createServer();
// Creates a new HTTP server instance (without a request handler yet).

const getJSONString = obj => {
    return JSON.stringify(obj, null, 2);
};
// Defines a helper function that converts a JavaScript object into a formatted JSON string 
// (for easy-to-read logging in the console).

app.on("request", (req, res) => {
    // Listens for 'request' events — triggered whenever a client sends an HTTP request.

    let body = [];
    // Initializes an empty array to collect incoming request data chunks.

    req.on("data", (bodyData) => {
        body.push(bodyData);
    });
    // Listens for 'data' events as chunks of the request body are received 
    // and pushes each chunk into the 'body' array.

    req.on("end", () => {
        body = Buffer.concat(body).toString();
        // Combines all the buffered data chunks and converts them into a string.

        console.log(`Request Body Contents: ${body}`);
        // Logs the full request body contents to the console.
    });

    console.log(`Method: ${getJSONString(req.method)}`);
    // Logs the HTTP method (e.g., GET, POST) used for the request.

    console.log(`URL: ${getJSONString(req.url)}`);
    // Logs the URL path requested by the client.

    console.log(`Headers: ${getJSONString(req.headers)}`);
    // Logs all the request headers (metadata sent by the client).

    res.writeHead(httpStatus.OK, {
        "Content-Type": "text/html"
    });
    // Sends a response header with status code 200 (OK) 
    // and specifies that the content being sent is HTML.

    let responseMessage = "<h1>This will show on the screen.</h1>";
    // Defines the HTML content that will be sent as the response.

    res.end(responseMessage);
    // Sends the response message to the client and closes the connection.
});

app.listen(port);
// Starts the server and makes it listen for requests on the defined port (3000).

console.log(`The server has started and is listening on port number: ${port}`);
// Logs a confirmation message to the console once the server is running.
