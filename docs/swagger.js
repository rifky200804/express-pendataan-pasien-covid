import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.APP_PORT || 3000;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient API',
      version: '1.0.0',
      description: 'API documentation for the Patient application',
    },
    servers: [
      {
        url: 'http://localhost:' + port,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUI };
