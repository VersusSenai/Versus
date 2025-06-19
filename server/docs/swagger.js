import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Versus Api',
      version: '1.0.0',
      description: 'Documentação do sistema de torneios Versus',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token', // nome do cookie usado no res.cookie
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para suas rotas com Swagger
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
