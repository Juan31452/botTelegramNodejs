class User {
    constructor(id, username, endTime = null) {
      this.id = id;
      this.username = username;
      this.endTime = endTime;
    }

    setEndTime(time) {
        this.endTime = time;   // Establece el tiempo de finalización
      }
  
    toString() {
      return `${this.username || 'SinUsername'}`;
    }
  }

  export default User;
  