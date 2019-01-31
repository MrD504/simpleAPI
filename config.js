/*
 * Create and export configuration variables
 *
 */

/* Container for all the environments */
let environments = {};

/* Staging object environment (default) */
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

/* Production environment */
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

/* Determine which environment should be exported */
let currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";
/* make sure requested environment exists */
let environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
