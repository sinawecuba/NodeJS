// Export a function to handle requests with URL parameters
exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable;        // Extract the 'vegetable' parameter from the URL
    res.send(`This is the page for ${veg}`); // Send a response including the vegetable name
};

// Export a function to handle POST requests
exports.sendPost = (req, res) => {
    console.log(req.body);                  // Log the request body to the console
    console.log(req.query);                 // Log the query string parameters to the console
    res.send("POST Successful!");           // Send a confirmation response to the client
};
