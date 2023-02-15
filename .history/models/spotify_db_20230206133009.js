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



sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    // sequelize.drop();
    // console.log("All tables dropped!");
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


const Track = sequelize.define("tracks", {
  isrc: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  spotify_image_uri: {
    type: DataTypes.STRING,
  },
  popularity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Artist = sequelize.define("artists", {
  id: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tracks: {
    type: DataTypes.JSON,
    allowNull: false
  }

});

sequelize.sync().then(() => {
  console.log('Spotify tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

 module.exports = {sequelize, Artist, Track};
