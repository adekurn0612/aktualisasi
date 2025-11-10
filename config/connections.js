// Mengganti 'import { Sequelize, QueryTypes } from "sequelize";'
const { Sequelize, QueryTypes } = require("sequelize");

// Initialize Sequelize instance for MySQL
const DB = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  // Port default MySQL adalah 3306, tapi Anda bisa mengaturnya dari env jika perlu
  port: process.env.DB_PORT || 3306,
  dialect: "mysql", // *** PERUBAHAN UTAMA: Ubah ke 'mysql' ***
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
  logging: false,
});

// Custom query function (tetap sama)
DB.queryString = function (querystring) {
  return new Promise(async (resolve, reject) => {
    try {
      // Execute the query using the Sequelize instance
      let query = await this.query(querystring, { type: QueryTypes.SELECT });
      resolve(query);
    } catch (error) {
      reject(error);
    }
  });
};

// Mengganti 'export const DB = new Sequelize...'
// Mengekspor objek DB (instance Sequelize) agar bisa diakses oleh model lain.
module.exports = { 
    DB,
    QueryTypes // Jika QueryTypes juga perlu diekspor (walaupun umumnya tidak)
};