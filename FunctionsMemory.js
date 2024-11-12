import { Markup } from 'telegraf';

// Estado de los juegos para cada usuario
const juegos = {};

// Inicializa el tablero y el estado del juego para un usuario específico
const iniciarJuego = (ctx, chatId) => {
  const emojis = ['🍎', '🍌', '🍒', '🍉', '🍇', '🍍', '🍑', '🥥'];
  const tableroEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  juegos[chatId] = {
    tablero: tableroEmojis,
    seleccionados: Array(16).fill('😊'),
    paresEncontrados: [],
    primeraSeleccion: null,
    messageId: null,
    startTime: Date.now(),
    intervalo: null
  };

  // Iniciar el temporizador que actualiza el tablero cada segundo
  juegos[chatId].intervalo = setInterval(() => actualizarTablero(ctx, chatId), 1000);
};

// Función para calcular el tiempo transcurrido en minutos y segundos
const tiempoTranscurrido = (startTime) => {
  const now = Date.now();
  const diff = now - startTime;
  const minutos = Math.floor(diff / 60000);
  const segundos = Math.floor((diff % 60000) / 1000);
  return `${minutos}m ${segundos}s`;
};

// Genera el teclado en línea de 4x4 basado en el estado actual del juego
const actualizarTablero = async (ctx, chatId) => {
  const { seleccionados, messageId, paresEncontrados, startTime } = juegos[chatId];
  const filas = [];

  for (let i = 0; i < seleccionados.length; i += 4) {
    filas.push(seleccionados.slice(i, i + 4).map((emoji, idx) => 
      Markup.button.callback(emoji, `card_${i + idx}`)
    ));
  }

  const teclado = Markup.inlineKeyboard(filas);

  // Texto superior que muestra los pares encontrados y el tiempo transcurrido
  const paresEncontradosCount = paresEncontrados.length / 2;
  const tiempo = tiempoTranscurrido(startTime);
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
    juegos[chatId].messageId = mensaje.message_id;
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
    const tiempoFinal = tiempoTranscurrido(juego.startTime);
    ctx.reply(`¡Felicidades! Has encontrado todos los pares en ${tiempoFinal} 🎉`);
    clearInterval(juego.intervalo); // Detener el temporizador
    delete juegos[chatId]; // Resetea el juego al completar
  }
};

// Función para iniciar un nuevo juego
export const iniciarJuegoMemoria = (ctx) => {
  const chatId = ctx.chat.id;
  
  // Inicializa el estado del juego para el usuario específico
  iniciarJuego(ctx, chatId);

  // Muestra el tablero inicial al usuario
  actualizarTablero(ctx, chatId);
  
  ctx.reply("¡Juego de memoria iniciado! Selecciona dos cuadros para encontrar los pares.");
};
