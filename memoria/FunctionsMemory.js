import { Markup } from 'telegraf';
import JuegoMemoria from './Clases/JuegoMemoria.js';
import Margen from './Clases/Margen.js';

// Estado de los juegos para cada usuario
const juegos = {};

// Genera el teclado en línea de 4x4 basado en el estado actual del juego
const actualizarTablero = async (ctx, chatId) => {
  const juego = juegos[chatId];
  const { seleccionados, messageId, paresEncontrados } = juego;
  const filas = [];

  for (let i = 0; i < seleccionados.length; i += 4) {
    filas.push(seleccionados.slice(i, i + 4).map((emoji, idx) => {
      const margen = new Margen(emoji, '[',']'); // Agrega un borde decorativo
      return Markup.button.callback(margen.conMargen(), `card_${i + idx}`);
    }));
  }
  const teclado = Markup.inlineKeyboard(filas);

  // Texto superior que muestra los pares encontrados y el tiempo transcurrido
  const paresEncontradosCount = paresEncontrados.length / 2;
  const tiempo = juego.tiempoTranscurrido(); // Usamos el método de la clase
  const textoTablero = `Tiempo: ${tiempo} | Pares encontrados: ${paresEncontradosCount}\nSeleccione Cuadro:`;

  // Edita el mensaje existente o envía uno nuevo si no existe
  if (messageId) {
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, messageId, null, textoTablero, teclado);
    } catch (error) {
      console.error('Error al editar el mensaje:', error);
    }
  } else {
    const mensaje = await ctx.reply(textoTablero, teclado);
    juego.messageId = mensaje.message_id;
  }
};

// Manejador para procesar la selección de una carta
export const manejarSeleccion = (ctx, index) => {
  const chatId = ctx.chat.id;
  const juego = juegos[chatId];
  const { tablero, seleccionados, primeraSeleccion, paresEncontrados } = juego;

  // Evita seleccionar una carta ya descubierta o seleccionada
  if (paresEncontrados.includes(index) || seleccionados[index] !== '😊') {
    return;
  }

  seleccionados[index] = tablero[index];

  if (primeraSeleccion === null) {
    juego.primeraSeleccion = index;
  } else {
    if (tablero[primeraSeleccion] === tablero[index]) {
      paresEncontrados.push(primeraSeleccion, index);
    } else {
      setTimeout(() => {
        seleccionados[index] = '😊';
        seleccionados[primeraSeleccion] = '😊';
        actualizarTablero(ctx, chatId);
      }, 1000);
    }
    juego.primeraSeleccion = null;
  }

  actualizarTablero(ctx, chatId);

  // Verifica si el usuario ha encontrado todos los pares
  if (paresEncontrados.length === tablero.length) {
    const tiempoFinal = juego.tiempoTranscurrido(juego.startTime);
    ctx.reply(`¡Felicidades! Has encontrado todos los pares en ${tiempoFinal} 🎉`);
    clearInterval(juego.intervalo); // Detener el temporizador
    delete juegos[chatId]; // Resetea el juego al completar
  }
};

// Función para inicializar el juego y registrarlo en el sistema
const iniciarJuego = (ctx, chatId) => {
  const juego = new JuegoMemoria(ctx, chatId);
  juegos[chatId] = juego;
  return juego;
};

// Ejemplo de cómo usar la clase
export const iniciarJuegoMemoria = (ctx) => {
  const chatId = ctx.chat.id;

  // Inicializa un nuevo juego para el usuario
  const juego = iniciarJuego(ctx, chatId);

  // Inicia el temporizador del juego
  juego.iniciarTemporizador(actualizarTablero);

  // Muestra el tablero inicial
  actualizarTablero(ctx, chatId);

  ctx.reply("¡Juego de memoria iniciado! Selecciona dos cuadros para encontrar los pares.");
};