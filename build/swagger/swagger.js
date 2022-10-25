"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options = {
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
exports.default = options;
//# sourceMappingURL=swagger.js.map