/**
 * @description Creates application
 * @author Milos Mihic <milosmihic9@gmail.com>
 */

// Importing node dependencies 
var url = require('url');
var { StringDecoder } = require('string_decoder');


// define the handlers
var handlers = {};

// ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

//hello found handler
handlers.hello = function (data, callback) {
    callback(200, { message: "Hello world!" });
}

//not found handler
handlers.notFound = function (data, callback) {
    callback(404);
}

// define router
var router = {
    'ping': handlers.ping,
    'hello': handlers.hello
};


module.exports = function (req, res) {

    // Get url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get path and trim it
    var path = parsedUrl.path ? parsedUrl.path.replace(/^\/+|\/+$/g, '') : '';

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', startPayload.bind({ decoder: decoder, buffer: buffer }));
    req.on('end', endPayload.bind({ decoder: decoder, buffer: buffer, path: path, queryStringObject: queryStringObject, method: method, headers: headers, response: res }));
}

/**
 * @description Handles on data event
 * @param {Buffer} data 
 */
function startPayload(data) {
    this.buffer += this.decoder.write(data);
}

/**
 * @description Handles on end event
 */
function endPayload() {
    this.buffer += this.decoder.end();

    // choose the handler this request should go to. If one is not found use not found handler
    var chooseHandler = typeof (router[this.path]) !== 'undefined' ? router[this.path] : handlers.notFound;

    delete this.decoder; // deletes decoder property because we do not want them for later usage 
    this['payload'] = this.buffer; // crates payload property and assign buffer to them
    delete this.buffer; // deletes buffer property

    chooseHandler(this, handleResponse.bind({ response: this.response }));
}

/**
 * @description Handles response
 * @param {Number} statusCode Represent HTTP status code 
 * @param {Object} payload Represent response object 
 */
function handleResponse(statusCode, payload) {
    // use status code called back by the handler, or default 
    statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
    // use the payload called back by the handler, or default to an empty object
    payload = typeof (payload) === 'object' ? payload : {};

    // Convert the payload to a string 
    var payloadString = JSON.stringify(payload);

    // return response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.writeHead(statusCode);
    this.response.end(payloadString);

    // Log to console
    console.log(`Returning response: \n STATUS: ${statusCode}\n ${payloadString}`);
}