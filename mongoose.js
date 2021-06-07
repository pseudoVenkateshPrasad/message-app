//require the library
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost/chatapp', {useNewUrlParser: true, useUnifiedTopology: true});

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
// db.on('error', function(err) { console.log(err.message); });
db.on('error', () => console.error.bind(console, "DB connection Failed") );

//up and running then print the message
db.once('open', () => console.log("Hii Admin, DataBase Connection Attempt Successful"));