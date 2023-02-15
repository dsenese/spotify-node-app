const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'spotify_db',
 'root',
 'DATABASE_PASSWORD',
  {
    host: 'DATABASE_HOST',
    dialect: 'mysql'
  }
);