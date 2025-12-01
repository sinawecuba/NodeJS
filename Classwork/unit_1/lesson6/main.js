// Import necessary modules and define constants
const port = 3000,                      // Port number the server will listen on
    http = require("http"),             // Built-in HTTP module for creating servers
    httpStatus = require("http-status-codes"), // Module for readable HTTP status codes
    fs = require("fs");                 // File System module for reading files

// ===============================
// BASIC ROUTE MAPPING EXAMPLE
// ===============================

// A simple route map connecting URLs to HTML files
const routeMap = {
    "/": "views/index.html" // When the root ("/") is requested, serve index.html
};

// Create an HTTP server
http
    .createServer((req, res) => {
        // Always send HTML response type
        res.writeHead(httpStatus.OK, {
            "Content-Type": "text/html"
        });

        // Check if the requested URL exists in the routeMap
        if (routeMap[req.url]) {
            // Read the corresponding HTML file from disk
            fs.readFile(routeMap[req.url], (error, data) => {
                res.write(data); // Send the file contents as the response
                res.end();       // End the response
            });
        } else {
            // Send a simple 404-style message if not found
            res.end("<h1>Sorry, not found.</h1>");
        }
    })
    .listen(port); // Start the server
console.log(`The server has started and is listening on port number: ${port}`);

// ===============================
// DYNAMIC VIEW HANDLER EXAMPLE
// ===============================

// Function to generate view paths dynamically (e.g., "/about" → "views/about.html")
const getViewUrl = (url) => {
    return `views${url}.html`;
};

// Another server that reads view files dynamically
http.createServer((req, res) => {
    let viewUrl = getViewUrl(req.url);

    // Read the corresponding file from disk
    fs.readFile(viewUrl, (error, data) => {
        if (error) {
            // If the file doesn't exist, send a 404
            res.writeHead(httpStatus.NOT_FOUND);
            res.write("<h1>FILE NOT FOUND</h1>");
        } else {
            // If found, send the HTML content
            res.writeHead(httpStatus.OK, {
                "Content-Type": "text/html"
            });
            res.write(data);
        }
        res.end(); // End the response
    });
}).listen(port);

console.log(`The server has started and is listening on port number: ${port}`);

// ===============================
// ERROR HANDLING AND STATIC FILE SERVER
// ===============================

// Function that sends a "404 Not Found" response
const sendErrorResponse = res => {
    res.writeHead(httpStatus.NOT_FOUND, {
        "Content-Type": "text/html"
    });
    res.write("<h1>File Not Found!</h1>");
    res.end();
};

// Server that handles multiple file types (HTML, CSS, JS, PNG)
http
    .createServer((req, res) => {
        let url = req.url;

        // Serve HTML files
        if (url.indexOf(".html") !== -1) {
            res.writeHead(httpStatus.OK, { "Content-Type": "text/html" });
            customReadFile(`./views${url}`, res);

        // Serve JavaScript files
        } else if (url.indexOf(".js") !== -1) {
            res.writeHead(httpStatus.OK, { "Content-Type": "text/javascript" });
            customReadFile(`./public/js${url}`, res);

        // Serve CSS files
        } else if (url.indexOf(".css") !== -1) {
            res.writeHead(httpStatus.OK, { "Content-Type": "text/css" });
            customReadFile(`./public/css${url}`, res);

        // Serve image files (PNG)
        } else if (url.indexOf(".png") !== -1) {
            res.writeHead(httpStatus.OK, { "Content-Type": "image/png" });
            customReadFile(`./public/images${url}`, res);

        // If none of the above, send a 404 error
        } else {
            sendErrorResponse(res);
        }
    })
    .listen(3000);

console.log(`The server is listening on port number: ${port}`);

// ===============================
// CUSTOM FILE READER FUNCTION
// ===============================

// Reads files safely, checks existence, and handles errors
const customReadFile = (file_path, res) => {
    if (fs.existsSync(file_path)) {
        fs.readFile(file_path, (error, data) => {
            if (error) {
                console.log(error);
                sendErrorResponse(res);
                return;
            }
            res.write(data); // Send file content
            res.end();       // End response
        });
    } else {
        sendErrorResponse(res);
    }
};

// ===============================
// ROUTER MODULE EXAMPLE (ADVANCED)
// ===============================

http = require("http");                    // Import HTTP module again
httpStatusCodes = require("http-status-codes"); // HTTP status codes
router = require("./router");              // Import a custom router module
fs = require("fs");                        // File system for reading files

// Define content types for responses
plainTextContentType = { "Content-Type": "text/plain" };
htmlContentType = { "Content-Type": "text/html" };

// A simpler custom file reader for router responses
customReadFile = (file, res) => {
    fs.readFile(`./${file}`, (errors, data) => {
        if (errors) {
            console.log("Error reading the file...");
        }
        res.end(data);
    });
};

// Define routes for GET and POST requests using the custom router
router.get("/", (req, res) => {
    res.writeHead(httpStatusCodes.OK, plainTextContentType);
    res.end("INDEX"); // Simple text response for root route
});

router.get("/index.html", (req, res) => {
    res.writeHead(httpStatusCodes.OK, htmlContentType);
    customReadFile("views/index.html", res); // Serve the index.html file
});

router.post("/", (req, res) => {
    res.writeHead(httpStatusCodes.OK, plainTextContentType);
    res.end("POSTED"); // Simple confirmation for POST requests
});

// Create a server that uses the router to handle routes
http.createServer(router.handle).listen(3000);

console.log(`The server is listening on port number: ${port}`);
