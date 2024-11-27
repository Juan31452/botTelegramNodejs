import { iniciarJuegoMemoria, manejarSeleccion } from './FunctionsMemory.js';

// Juego de memoria
export default function JuegoMemoria(bot) {
bot.hears('🎮 Memoria', (ctx) => {
    iniciarJuegoMemoria(ctx);
  });
  
  // Manejador para capturar los eventos de selección de las cartas mediante callback
  bot.action(/card_(\d+)/, (ctx) => {
    const index = parseInt(ctx.match[1], 10); // Extrae el índice de la carta seleccionada
    manejarSeleccion(ctx, index); // Llama a la función que procesa la selección
    ctx.answerCbQuery(); // Limpia la acción para evitar mensajes de espera
  });
}