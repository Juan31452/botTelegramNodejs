// Menú de Limpieza 
const juegomemoria = (ctx) => {
    ctx.reply(
      'Seleccione Cuadro:',
      Markup.keyboard([
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['😊', '😊', '😊','😊'],
        ['⬅️ Menu Principal']
      ]).resize()
    );
  };
  