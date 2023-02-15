const {Sequelize, DataTypes} = require("sequelize");
const sequelize = new Sequelize(
 'spotify_db',
 'root',
 'italiano',
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);

const Book = sequelize.define("books", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  release_date: {
    type: DataTypes.DATEONLY,
  },
  subject: {
    type: DataTypes.INTEGER,
  }
});


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
 module.exports = sequelize;