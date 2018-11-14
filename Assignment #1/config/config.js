/**
 * @description Create and export configuration variables
 * @author Milos Mihic <milosmihic9@gmail.com>
 */

// Container for all the environments
var environments = {};

// Development (default) environment
environments.development = {
    'port': 3000,
    'envName': 'development'
};

// Production environment
environments.production = {
    'port': 5000,
    'envName': 'production'
};

// Determine witch environment was passed as command-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default development
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentToExport;
