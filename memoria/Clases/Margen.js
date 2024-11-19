class Margen {
  constructor(emoji, bordeD = '[', bordeI = ']') {
    this.emoji = emoji; // Emoji principal
    this.bordeD = bordeD; // Borde o decoración alrededor del emoji
    this.bordeI = bordeI; // Borde o decoración alrededor del emoji

  }

  // Método para generar el contenido del botón con margen
  conMargen() {
    return `${this.bordeD} ${this.emoji} ${this.bordeI}`;
  }
}

export default Margen;

