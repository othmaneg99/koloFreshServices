// Node.js program to demonstrate the
// Date.addHours() method

// Importing module
const date = require('date-and-time')

// Creating object of current date and time
// by using Date()

const now = new Date();

// Adding Hours to the existing date and time
// by using date.addHours() method

const value = date.addHours(now,1);

// Display the result
console.log(now)
console.log(value)
