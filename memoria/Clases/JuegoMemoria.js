 class JuegoMemoria {
    constructor(ctx, chatId) {
      this.chatId = chatId;
      this.ctx = ctx;
      this.emojis = ['🍎', '🍌', '🍒', '🍉', '🍇', '🍍', '🍑', '🥥'];
      this.tablero = [...this.emojis, ...this.emojis].sort(() => Math.random() - 0.5);
      this.seleccionados = Array(16).fill('😊');
      this.paresEncontrados = [];
      this.primeraSeleccion = null;
      this.messageId = null;
      this.startTime = Date.now();
      this.intervalo = null;
    }
  
    iniciarTemporizador(actualizarTableroCallback) {
      this.intervalo = setInterval(() => {
        actualizarTableroCallback(this.ctx, this.chatId);
      }, 1000);
    }
  
    detenerTemporizador() {
      if (this.intervalo) {
        clearInterval(this.intervalo);
        this.intervalo = null;
      }
    }
  
    tiempoTranscurrido() {
      const now = Date.now();
      const diff = now - this.startTime;
      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      return `${minutos}m ${segundos}s`;
    }
  }
  
  export default JuegoMemoria;