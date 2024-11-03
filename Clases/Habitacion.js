// Habitacion.js
export class Habitacion {
  constructor(numero, estado) {
    this.numero = numero;
    this.estado = estado;

    // Inicializa los atributos de ropa con valores predeterminados en 0 (sin seleccionar)
    this.bajera = 0;
    this.encimera = 0;
    this.fundaA = 0;
    this.protectorA = 0;
    this.nordica = 0;
    this.toallaD = 0;
    this.toallaL = 0;
    this.alfombrin = 0;
    this.colchaV = 0;
  }

  // Método para actualizar la cantidad de un tipo de ropa
  actualizarTipoRopa(tipo, cantidad) {
    if (this.hasOwnProperty(tipo)) {
      this[tipo] = cantidad;
    } else {
      console.error(`Tipo de ropa "${tipo}" no encontrado en la habitación.`);
    }
  }
}
