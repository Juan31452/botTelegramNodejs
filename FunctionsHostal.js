// FunctionsHostal.js
import { Markup } from 'telegraf';
import { Habitacion } from './Clases/Habitacion.js';
import TipoEstado from './Clases/TipoEstado.js';
import TipoRopa from './Clases/TipoRopa.js';

// Función para mostrar el menú principal
export const mostrarMenuPrincipal = (ctx) => {
    ctx.reply(
      `¡Hola, ${ctx.from.first_name}! Selecciona una opción:`,
      Markup.keyboard([
        ['Limpieza'],       // Opción de Limpieza
        ['Memoria']         // Opción de juego de memoria
      ]).resize().oneTime(false) // Asegura que los botones permanezcan en pantalla
    );
};

// Menú de Limpieza
export const mostrarMenuHabitacion = (ctx) => {
  ctx.reply(
    'Selecciona la Habitación:',
    Markup.keyboard([
      ['002', '101', '102'],
      ['201', '202', '203'],
      ['Lista', '⬅️ Menu Principal']
    ]).resize()
  );
};

// Función para manejar la selección de la habitación
export const manejarSeleccionHabitacion = (numeroHabitacion, ctx) => {
  // Asegurarse de que `ctx.session` esté inicializado
  if (!ctx.session) ctx.session = {};
  
  ctx.session.habitacionSeleccionada = new Habitacion(numeroHabitacion, ''); // Estado vacío inicialmente

  ctx.reply(
    `Habitación ${ctx.session.habitacionSeleccionada.numero}. Ahora selecciona el estado:`,
    Markup.keyboard([
      [TipoEstado.ESTADOS.ESTANCIA],
      [TipoEstado.ESTADOS.SALIDA],
      [TipoEstado.ESTADOS.SALIDA_ENTRADA],
      [TipoEstado.ESTADOS.CHECKIN],
      [TipoEstado.ESTADOS.REPASO],
      ['⬅️ Habitacion']
    ]).resize()
  );
};

// Función para mostrar el menú de cantidad
export const mostrarMenuNumerico = (ctx) => {
  ctx.reply(
    'Selecciona la cantidad:',
    Markup.keyboard([
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['0', '⬅️']
    ]).resize()
  );
};

// Función para mostrar el menú de tipo de ropa
export const mostrarMenuTipoRopa = (ctx) => {
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
export const menunumerico = (ctx) => {
    ctx.reply(
      `Selecciona una cantidad:`,
      Markup.keyboard([
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['0', '⬅️ Atras']
      ])
      .oneTime()
      .resize()
    );
  };
  
// Función para confirmar si desea agregar más
export const mostrarAgregarMas = (ctx) => {
  ctx.reply(
    '¿Quieres agregar más tipos de ropa?',
    Markup.keyboard([
      ['Sí 😊'], ['No']
    ]).resize()
  );
};

// Función para mostrar los datos guardados de la habitación
export const mostrarDatosHabitacion = (ctx) => {
    const habitacion = ctx.session.habitacionSeleccionada;
    if (habitacion) {
      const datos = `
        **Datos de la Habitación:**
        - Número: ${habitacion.numero}
        - Estado: ${habitacion.estado}
        - Bajera: ${habitacion.bajera || 0}
        - Encimera: ${habitacion.encimera || 0}
        - Funda Almohada: ${habitacion.fundaA || 0}
        - Protector Almohada: ${habitacion.protectorA || 0}
        - Nórdica: ${habitacion.nordica || 0}
        - Toalla Ducha: ${habitacion.toallaD || 0}
        - Toalla Lavabo: ${habitacion.toallaL || 0}
        - Alfombrín: ${habitacion.alfombrin || 0}
        - Colcha Verano: ${habitacion.colchaV || 0}
      `;
      
      ctx.reply(datos, { parse_mode: 'Markdown' }); // Envío del mensaje con formato
    } else {
      ctx.reply('No hay datos de habitación guardados.');
    }
  };
  