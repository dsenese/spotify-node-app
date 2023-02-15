const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'spotify_db',
 'root',
 '',
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);