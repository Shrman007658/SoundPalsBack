const mysql = require('mysql2');

class MySQLConnectionFactory {
  constructor() {
    this.connection = this.createConnection();
  }

  async createConnection() {
    return new Promise((resolve, reject) => {
      const mysqlconn = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
      });

      mysqlconn.connect((err) => {
        if (err) {
          console.log('Connection Error to MYSQL DB ' + err.stack);
          reject(err);
        } else {
          console.log('Connection Success to MYSQL DB');
          resolve(mysqlconn);
        }
      });
    });
  }

  async getConnection() {
    if (!this.connection) {
      this.connection = await this.createConnection();
    }
    return this.connection;
  }
}

module.exports = new MySQLConnectionFactory();
