/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
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
swaggerAutogen(outputFile, endpointsFiles, doc);