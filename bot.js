// Importación 
import { Telegraf, Markup } from 'telegraf';
import { session } from 'telegraf'; // Importa session desde 'telegraf'
import { Habitacion } from './Clases/Habitacion.js';
import TipoEstado from './Clases/TipoEstado.js';
import TipoRopa from './Clases/TipoRopa.js';

// Reemplaza con el token de tu bot
const bot = new Telegraf('7866028825:AAG8karTtat_f5P6V179COvkYF9-H24S2vQ');

// Configura el middleware de sesión
bot.use(session());

// Objeto para almacenar la habitación seleccionada por el usuario
let habitacionSeleccionada = null;

// Comando /start que muestra el menú principal
bot.start((ctx) => {
  ctx.session = {};
  ctx.session.tipoSeleccionado = null; // Inicializa la sesión
  mostrarMenuPrincipal(ctx);
});

// Función para mostrar el menú principal
const mostrarMenuPrincipal = (ctx) => {
  ctx.reply(
    `¡Hola, ${ctx.from.first_name}! Selecciona una opción:`,
    Markup.keyboard([
      ['Limpieza'],       // Opción de Limpieza
      ['Atención al Cliente'] // Opción de Atención al Cliente
    ]).resize()
  );
};

// Menú de Limpieza 
const mostrarMenuHabitacion = (ctx) => {
  ctx.reply(
    'Selecciona la Habitación:',
    Markup.keyboard([
      ['002', '101', '102'],
      ['201', '202', '203'],
      ['Lista', '⬅️ Menú Principal']
    ]).resize()
  );
};

// Función para manejar la selección de la habitación
const manejarSeleccionHabitacion = (numeroHabitacion, ctx) => {
  habitacionSeleccionada = new Habitacion(numeroHabitacion, ''); // Estado vacío inicialmente

  ctx.reply(
    `Habitación ${habitacionSeleccionada.numero}. Ahora selecciona el estado:`,
    Markup.keyboard([
      [TipoEstado.ESTADOS.ESTANCIA],
      [TipoEstado.ESTADOS.SALIDA],
      [TipoEstado.ESTADOS.SALIDA_ENTRADA],
      [TipoEstado.ESTADOS.CHECKIN],
      [TipoEstado.ESTADOS.REPASO],
      ['⬅️ Menú Principal']
    ]).resize()
  );
};

// Función para mostrar el menú de tipo de ropa
const mostrarMenuTipoRopa = (ctx) => {
  ctx.reply(
    `Selecciona el tipo de ropa:`,
    Markup.keyboard([
      [TipoRopa.TIPOS.BAJERA],
      [TipoRopa.TIPOS.ENCIMERA],
      [TipoRopa.TIPOS.FUNDA_ALMOHADA],
      [TipoRopa.TIPOS.PROTECTOR_ALMOHADA],
      [TipoRopa.TIPOS.NORDICA],
      [TipoRopa.TIPOS.T_DUCHA],
      [TipoRopa.TIPOS.T_LAVABO],
      [TipoRopa.TIPOS.ALFOMBRIN],
      [TipoRopa.TIPOS.COLCHA_VERANO],
      ['⬅️ Menú Principal']
    ]).resize()
  );
};

// Función para mostrar menú numérico
const menunumerico = (ctx) => {
  ctx.reply(
    `Selecciona una cantidad:`,
    Markup.keyboard([
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['0', '⬅️ Volver']
    ])
    .oneTime()
    .resize()
  );
};

// Función para mostrar el mensaje "¿Agregar más?"
const mostrarAgregarMas = (ctx) => {
  ctx.reply(
    '¿Agregar más?',
    Markup.keyboard([
      ['Sí', 'No']
    ]).resize()
  );
};

// Función para mostrar los datos guardados de la habitación
const mostrarDatosHabitacion = (ctx) => {
  if (habitacionSeleccionada) {
    const datos = `
      **Datos de la Habitación:**
      - Número: ${habitacionSeleccionada.numero}
      - Estado: ${habitacionSeleccionada.estado}
      - Bajera: ${habitacionSeleccionada.bajera || 0}
      - Encimera: ${habitacionSeleccionada.encimera || 0}
      - Funda Almohada: ${habitacionSeleccionada.fundaA || 0}
      - Protector Almohada: ${habitacionSeleccionada.protectorA || 0}
      - Nórdica: ${habitacionSeleccionada.nordica || 0}
      - Toalla Ducha: ${habitacionSeleccionada.toallaD || 0}
      - Toalla Lavabo: ${habitacionSeleccionada.toallaL || 0}
      - Alfombrín: ${habitacionSeleccionada.alfombrin || 0}
      - Colcha Verano: ${habitacionSeleccionada.colchaV || 0}
    `;
    
    ctx.reply(datos, { parse_mode: 'Markdown' }); // Envío del mensaje con formato
  } else {
    ctx.reply('No hay datos de habitación guardados.');
  }
};

// Maneja la selección de la habitación
bot.hears(/002|101|102|201|202|203/, (ctx) => {
  const numeroHabitacion = ctx.message.text;
  manejarSeleccionHabitacion(numeroHabitacion, ctx); // Llama a la función
});

// Escucha las opciones específicas de artículos
bot.hears(Object.values(TipoRopa.TIPOS), (ctx) => {
  const tipoSeleccionado = ctx.message.text;

  // Verifica que la sesión esté inicializada
  if (!ctx.session) {
    ctx.session = {}; // Inicializa la sesión si no está definida
  }

  ctx.session.tipoSeleccionado = tipoSeleccionado; // Guarda el tipo seleccionado temporalmente en la sesión

  ctx.reply(`Ingresa la cantidad para ${tipoSeleccionado}:`);
  menunumerico(ctx); // Esta función muestra el teclado numérico
});

// Escucha la cantidad seleccionada y luego pregunta si desea agregar más
bot.hears(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], (ctx) => {
  const cantidadSeleccionada = ctx.message.text;
  const tipoSeleccionado = ctx.session.tipoSeleccionado; //recupero tipo de ropa seleccionada

  if (habitacionSeleccionada && tipoSeleccionado) {
    // Actualiza la cantidad en el objeto habitacionSeleccionada según el tipo de ropa
    switch (tipoSeleccionado) {
      case TipoRopa.TIPOS.BAJERA:
        habitacionSeleccionada.bajera = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.ENCIMERA:
        habitacionSeleccionada.encimera = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.FUNDA_ALMOHADA:
        habitacionSeleccionada.fundaA = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.PROTECTOR_ALMOHADA:
        habitacionSeleccionada.protectorA = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.NORDICA:
        habitacionSeleccionada.nordica = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.T_DUCHA:
        habitacionSeleccionada.toallaD = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.T_LAVABO:
        habitacionSeleccionada.toallaL = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.ALFOMBRIN:
        habitacionSeleccionada.alfombrin = cantidadSeleccionada;
        break;
      case TipoRopa.TIPOS.COLCHA_VERANO:
        habitacionSeleccionada.colchaV = cantidadSeleccionada;
        break;
    }
  }

  mostrarAgregarMas(ctx); // Pregunta si quiere agregar más
});

// Escucha la respuesta a "¿Agregar más?"
bot.hears('Sí', (ctx) => {
  mostrarMenuTipoRopa(ctx); // Si es "Sí", vuelve a mostrar el menú de tipo de ropa
});

bot.hears('No', (ctx) => {
  mostrarMenuHabitacion(ctx); // Si es "No", vuelve al menú principal
});

// Mostrar el menú principal cuando el usuario escribe "menu"
bot.hears(/Menu/i, (ctx) => {
  mostrarMenuPrincipal(ctx);
});

// Escucha los estados y muestra el menú de tipo de ropa cuando se selecciona un estado
bot.hears(Object.values(TipoEstado.ESTADOS), (ctx) => {
  const estadoSeleccionado = ctx.message.text;
  habitacionSeleccionada.estado = estadoSeleccionado; // Asigna el estado seleccionado
  
  ctx.reply(`Has seleccionado el estado: ${estadoSeleccionado}. Escoge el tipo de ropa:`);
  mostrarMenuTipoRopa(ctx); // Llamada a la función de menú de tipo de ropa
});


// Mostrar el menú principal cuando el usuario escribe "menu"
bot.hears('⬅️', (ctx) => {
  mostrarMenuPrincipal(ctx);
});

// Opción para volver al menú principal y ejecutar la misma función del comando /start
bot.hears('⬅️ Menú Principal', (ctx) => {
  mostrarMenuPrincipal(ctx);
});

// Opción de Limpieza
bot.hears('Limpieza', (ctx) => {
  mostrarMenuHabitacion(ctx); // Llama a la función para mostrar el menú de habitaciones
});

//Lista Limpieza
bot.hears('Lista', (ctx) => {
  mostrarDatosHabitacion(ctx);
});


// Inicia el bot
bot.launch();

// Manejo de señales para detener el bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
