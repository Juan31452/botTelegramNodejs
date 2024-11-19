// Importación 
import { Telegraf, session } from 'telegraf';

import { mostrarMenuPrincipal, mostrarMenuHabitacion, manejarSeleccionHabitacion, mostrarMenuTipoRopa, menunumerico, mostrarAgregarMas, mostrarDatosHabitacion } from './Hostal/FunctionsHostal.js';
import {iniciarJuegoMemoria, manejarSeleccion} from './memoria/FunctionsMemory.js';
import { Habitacion } from './Hostal/Clases/Habitacion.js';
import TipoRopa from './Hostal/Clases/TipoRopa.js';
import TipoEstado from './Hostal/Clases/TipoEstado.js';


// token de tu bot
const bot = new Telegraf('7866028825:AAG8karTtat_f5P6V179COvkYF9-H24S2vQ');

// Configura el middleware de sesión
bot.use(session());

// Comando /start que muestra el menú principal
bot.start((ctx) => {
  if (!ctx.session) ctx.session = {};  // Inicializa la sesión si no está definida
  ctx.session.tipoSeleccionado = null; // Inicializa la sesión
  ctx.session.habitacionSeleccionada = null; // Almacena la habitación en la sesión
  mostrarMenuPrincipal(ctx);
});

// volver a menu
bot.hears('⬅️ Menu Principal', (ctx) => {
  mostrarMenuPrincipal(ctx); // Llama a la función para mostrar el menú de habitaciones
});

// Escucha "Menu" y redirige al menú principal
bot.hears(/Menu/i, (ctx) => {
  mostrarMenuPrincipal(ctx); // Llama a la función para mostrar el menú principal
});

// Maneja la selección de la habitación
bot.hears(/002|101|102|201|202|203/, (ctx) => {
  const numeroHabitacion = ctx.message.text;
  if (!ctx.session) ctx.session = {};  // Inicializa la sesión si no está definida
  ctx.session.habitacionSeleccionada = new Habitacion(numeroHabitacion, ''); // Estado vacío inicialmente
  manejarSeleccionHabitacion(numeroHabitacion, ctx); // Llama a la función
});

// Escucha las opciones específicas de artículos
bot.hears(Object.values(TipoRopa.TIPOS), (ctx) => {
  const tipoSeleccionado = ctx.message.text;

  if (!ctx.session) {
    ctx.session = {}; // Inicializa la sesión si no está definida
  }

  ctx.session.tipoSeleccionado = tipoSeleccionado; // Guarda el tipo seleccionado temporalmente en la sesión

  ctx.reply(`Ingresa la cantidad para ${tipoSeleccionado}:`);
  menunumerico(ctx); // Esta función muestra el teclado numérico
});

// Escucha la cantidad seleccionada y luego pregunta si desea agregar más
bot.hears(/^[0-9]$/, (ctx) => {
  const cantidadSeleccionada = ctx.message.text;
  const tipoSeleccionado = ctx.session.tipoSeleccionado; // Recupera el tipo de ropa seleccionado

  if (ctx.session.habitacionSeleccionada && tipoSeleccionado) {
    // Actualiza la cantidad en el objeto habitacionSeleccionada según el tipo de ropa
    switch (tipoSeleccionado) {
      case TipoRopa.TIPOS.BAJERA:
        ctx.session.habitacionSeleccionada.bajera = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.ENCIMERA:
        ctx.session.habitacionSeleccionada.encimera = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.FUNDA_ALMOHADA:
        ctx.session.habitacionSeleccionada.fundaA = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.PROTECTOR_ALMOHADA:
        ctx.session.habitacionSeleccionada.protectorA = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.NORDICA:
        ctx.session.habitacionSeleccionada.nordica = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.T_DUCHA:
        ctx.session.habitacionSeleccionada.toallaD = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.T_LAVABO:
        ctx.session.habitacionSeleccionada.toallaL = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.ALFOMBRIN:
        ctx.session.habitacionSeleccionada.colchaV = cantidadSeleccionada;
        break;
    }
  }

  mostrarAgregarMas(ctx); // Pregunta si quiere agregar más
});

// Escucha la respuesta a "¿Agregar más?"
bot.hears('Sí 😊', (ctx) => {
  mostrarMenuTipoRopa(ctx); // Si es "Sí", vuelve a mostrar el menú de tipo de ropa
});

// Escucha si el usuario elige no agregar más
bot.hears('No', (ctx) => {
  mostrarMenuHabitacion(ctx); // Si es "No", vuelve al menú de selección de habitaciones
});

// Escucha los estados y muestra el menú de tipo de ropa cuando se selecciona un estado
bot.hears(Object.values(TipoEstado.ESTADOS), (ctx) => {
  const estadoSeleccionado = ctx.message.text;
  ctx.session.habitacionSeleccionada.estado = estadoSeleccionado; // Asigna el estado seleccionado
  
  ctx.reply(`Has seleccionado el estado: ${estadoSeleccionado}. Escoge el tipo de ropa:`);
  mostrarMenuTipoRopa(ctx); // Llamada a la función de menú de tipo de ropa
});

// Opción de Limpieza
bot.hears('Limpieza', (ctx) => {
  mostrarMenuHabitacion(ctx); // Llama a la función para mostrar el menú de habitaciones
});

// Lista Limpieza
bot.hears('Lista', (ctx) => {
  if (!ctx.session) ctx.session = {};  // Inicializa la sesión si no está definida
   mostrarDatosHabitacion(ctx); // Muestra los datos guardados de la habitación actual
});

// Juego de memoria
bot.hears('Memoria', (ctx) => {
  iniciarJuegoMemoria(ctx);
});

// Manejador para capturar los eventos de selección de las cartas mediante callback
bot.action(/card_(\d+)/, (ctx) => {
  const index = parseInt(ctx.match[1], 10); // Extrae el índice de la carta seleccionada
  manejarSeleccion(ctx, index); // Llama a la función que procesa la selección
  ctx.answerCbQuery(); // Limpia la acción para evitar mensajes de espera
});


// Inicia el bot
bot.launch();

// Manejo de señales para detener el bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));