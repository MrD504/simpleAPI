/*
 * Create and export configuration variables
 *
 */

 /* Container for all the environments */
 let environments = {};

 /* Staging object environment (default) */
 environments.staging = {
   "port": 3000,
   "envName": "staging"
 };

/* Production environment */
 environments.production = {
   "port": 5000,
   "envName": "production"
 };

 /* Determine which environment should be exported */
 let currentEnvironment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : '';
 /* make sure requested environment exists */
 let environmentToExport = typeof(environments[currentEnvironment]) == "object" ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
