const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'spotify_db',
 'DATABASE_USERNAME',
 'DATABASE_PASSWORD',
  {
    host: 'DATABASE_HOST',
    dialect: 'mysql'
  }
);