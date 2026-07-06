const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'API-AEC',
        version: '1.0.0',
        description: 'API de Auditoría de Eventos Críticos',
    },
    servers: [
        {
            url: 'http://localhost:5100',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
        },
        },
    },
    },
    apis: ['./src/routes/**/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;