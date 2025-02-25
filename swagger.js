const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Aplicación de Plantas',
      version: '1.0.0',
      description: 'Documentación de la API de la aplicación de plantas',
    },
  },
  apis: ['./index2.js', './routes/*.js'], // Incluimos las rutas de la carpeta routes
}

// Generamos la documentación
const swaggerDocs = swaggerJsdoc(swaggerOptions)

// Exportamos la configuración para usarla en el archivo principal
module.exports = {
  swaggerUi,
  swaggerDocs,
}
