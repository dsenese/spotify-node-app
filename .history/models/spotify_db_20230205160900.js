const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'spotify_db',
 'root',
 '',
  {
    host: 'DATABASE_HOST',
    dialect: 'mysql'
  }
);