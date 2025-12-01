// Import the built-in HTTP module to create a server
const http = require('http')

// Import the built-in File System module to read files
const fs = require('fs')

// Read the content of 'index.html' into memory
const homePage = fs.readFileSync('index.html')

// Read the content of 'about.html' into memory
const aboutPage = fs.readFileSync('about.html')

// Read the content of 'contact.html' into memory
const contactPage = fs.readFileSync('contact.html')

// Read the content of 'notfound.html' into memory (for 404 errors)
const notFoundPage = fs.readFileSync('notfound.html')

// Create an HTTP server that handles incoming requests
const server = http.createServer((req, res) => {

    // If the request URL is '/about', send the about page
    if (req.url === '/about')
        res.end(aboutPage)

    // If the request URL is '/contact', send the contact page
    else if (req.url === '/contact')
        res.end(contactPage)

    // If the request URL is '/', send the home page
    else if (req.url === '/')
        res.end(homePage)

    // If none of the above, send a 404 status code and the not found page
    else {
        res.writeHead(404) // Set HTTP status code to 404 (Not Found)
        res.end(notFoundPage)
    }
})

// Start the server and have it listen on port 3000
server.listen(3000)