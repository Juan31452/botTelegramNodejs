
const { Telegraf, Markup } = require('telegraf');

// Reemplaza con el token de tu bot
const bot = new Telegraf('7866028825:AAG8karTtat_f5P6V179COvkYF9-H24S2vQ');

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

// Comando /start que muestra el menú principal
bot.start((ctx) => {
  mostrarMenuPrincipal(ctx);
});

// Menú de Limpieza con opciones para ingresar cantidad
bot.hears('Limpieza', (ctx) => {
  ctx.reply(
    'Selecciona el artículo para ingresar la cantidad:',
    Markup.keyboard([
      ['Bajera', 'Encimera'],
      ['Funda Almohada'],
      ['⬅️ Volver al menú principal']
    ]).resize()
  );
});

// Función para mostrar el menú principal
const menunumerico = (ctx) => {
  ctx.reply(
    `¡Hola, ${ctx.from.first_name}! Selecciona una opción:`,
    Markup.keyboard([
      ['1','2','3'],       
      ['4','5','6'],
      ['7','8','9'],
      ['0','⬅️']
      
    ]).resize()
  );
};

// Escucha las opciones específicas de artículos
bot.hears(['Bajera', 'Encimera', 'Funda Almohada'], (ctx) => {
  const articulo = ctx.message.text;
  ctx.reply(`Ingresa la cantidad para ${articulo}:`);
  menunumerico(ctx);
});

bot.command('mycommand',(ctx) => {
  ctx.reply('My Command');
});

bot.hears('Juan',(ctx) => {
  ctx.reply('Hola Juan');
});

// Opción para volver al menú principal y ejecutar la misma función del comando /start
bot.hears('⬅️ Volver al menú principal', (ctx) => {
  mostrarMenuPrincipal(ctx);
});


// Inicia el bot
bot.launch();

// Manejo de señales para detener el bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
