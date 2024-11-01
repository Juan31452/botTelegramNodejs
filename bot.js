
const { Telegraf } = require('telegraf');

// Reemplaza con el token de tu bot
const bot = new Telegraf('7866028825:AAG8karTtat_f5P6V179COvkYF9-H24S2vQ');

// Responde al comando '/start'
bot.start((ctx) => {
  ctx.reply('¡Hola! ' + ctx.from.first_name + ' ' + ctx.from.last_name);
});

bot.command('mycommand',(ctx) => {
  ctx.reply('My Command');
});

bot.hears('Juan',(ctx) => {
  ctx.reply('Hola Juan');
});

// Inicia el bot
bot.launch();

// Manejo de señales para detener el bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
