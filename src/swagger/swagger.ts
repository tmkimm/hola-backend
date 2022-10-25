const options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'Hola REST API Docs.',
      version: '1.0.0',
      description: 'hola!',
    },
    servers: [
      {
        url: 'http://127.0.0.1:5000/api',
      },
    ],
  },
  apis: ['**/*.ts'],
};
export default options;
