import { mostrarMenuPrincipal, mostrarMenuHabitacion, manejarSeleccionHabitacion, mostrarMenuTipoRopa, menunumerico, 
    mostrarAgregarMas, mostrarDatosHabitacion, inicializarSesion } from './FunctionsHostal.js';
  import { Habitacion } from './Clases/Habitacion.js';
  import TipoRopa from './Clases/TipoRopa.js';
  import TipoEstado from './Clases/TipoEstado.js';
  
  export default function limpieza(bot) {
    
    // Comando /start que muestra el menú principal
bot.start((ctx) => {
    inicializarSesion(ctx); // Inicializa la sesión del usuario
    mostrarMenuPrincipal(ctx); // Muestra el menú principal
  });
  
  // Escucha cualquier mensaje relacionado con el menú
  bot.hears(/^(⬅️ Menu Principal|Menu)$/i, (ctx) => {
    mostrarMenuPrincipal(ctx); // Muestra el menú principal independientemente del texto
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
  bot.hears('🧹 Limpieza', (ctx) => {
    mostrarMenuHabitacion(ctx); // Llama a la función para mostrar el menú de habitaciones
  });
  
  // Lista Limpieza
  bot.hears('Lista', (ctx) => {
    if (!ctx.session) ctx.session = {};  // Inicializa la sesión si no está definida
     mostrarDatosHabitacion(ctx); // Muestra los datos guardados de la habitación actual
  });
  
  }