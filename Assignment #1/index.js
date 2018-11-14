/**
 * @description Main
 * @author Milos Mihic <milosmihic9@gmail.com>
 */

// Importing node dependencies 
var http = require('http');

// Importing custom config
var config = require('./config/config');
// Imports application
var app = require('./app');

// Creates server
var server = http.createServer(app);

// Start the server
server.listen(config.port, function () {
    console.log(`Server is listening on ${config.port} in ${config.envName}`);
});