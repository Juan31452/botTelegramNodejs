import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bot from './bot.js';

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

// Configuración de CORS y Middleware
app.use(cors());
app.use(bodyParser.json());

// Variables de entorno
const { API_PORT } = process.env;

// Inicializa el servidor Express
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando' });
  });
  
  // Inicia el servidor Express en el puerto configurado
  app.listen(API_PORT || 4000, () => {
    console.log(`Servidor Express corriendo en el puerto ${API_PORT || 4000}`);
  });
  
  // Manejo de señales para detener el bot cuando el servidor se detenga
  process.once('SIGINT', () => {
    bot.stop('SIGINT');
    process.exit(0);
  });
  
  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    process.exit(0);
});
