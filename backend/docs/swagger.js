/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
    language: 'en-US',      // Change response language. By default is 'en-US'
}

const router = require('../routes/main');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    description: 'API for BookSwapApp', 
  },
  host: 'localhost:8000',      // PROD: 'config.swagger.host'
  basePath: '/docs'
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['../routes/main.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//     require('./index.js'); // Your project's root file
//   });