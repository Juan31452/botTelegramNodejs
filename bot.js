// Importación 
import { Telegraf, session } from 'telegraf';
import Memoria from './memoria/Memoria.js';
import limpieza from './Hostal/LImpieza.js';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Verificar si el token está presente en el entorno
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('El token del bot no está configurado en el archivo .env');
  process.exit(1); // Salir si no hay token
}

// token de tu bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Configura el middleware de sesión
bot.use(session());

// Registra las funcionalidades del bot
limpieza(bot); // Funciones relacionadas con limpieza
Memoria(bot);  // Funciones relacionadas con el juego de memoria


// Inicia el bot
bot.launch();

// Manejo de señales para detener el bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Exportar el bot para poder usarlo en otros archivos
export default bot;