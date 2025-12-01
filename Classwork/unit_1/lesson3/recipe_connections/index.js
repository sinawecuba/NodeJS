"use strict";
// Enables strict mode — helps you write cleaner, more reliable code 
// by preventing certain unsafe actions (like using undeclared variables).

const cities = require("cities");
// Imports the "cities" module, which allows you to look up city information by ZIP code.

var myCity = cities.zip_lookup("10016");
// Looks up information for the ZIP code "10016" (New York, NY) 
// and stores the result in the variable 'myCity'.

console.log(myCity);
// Prints the city information (such as city name, state, and coordinates) to the console.
