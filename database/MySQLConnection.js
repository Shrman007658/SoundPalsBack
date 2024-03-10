const mysql = require('mysql2/promise');

class MySQLConnectionFactory {
  constructor() {
    console.log("Constructor Called")
    this.pool = this.createPool();
  }

  async createPool() {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
      connectionLimit: process.env.POOL_SIZE // Set the connection pool size to 20
    });
    try {
      await pool.getConnection()
      console.log("MYSQL POOL INSTANTIATED!")
      return pool;
    } catch (error) {
      console.error(error)
      throw new Error("MYSQL NOT CONNECTED")
    }
  }

  async getConnection() {
    try {
      return this.pool;
    } catch (error) {
      console.error('Error getting connection from pool:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  }
}

// Create a single instance of MySQLConnectionFactory
const mysqlConnectionFactory = new MySQLConnectionFactory();

// Export the instance of MySQLConnectionFactory
module.exports = mysqlConnectionFactory;
