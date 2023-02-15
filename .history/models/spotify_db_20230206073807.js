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
  artist_ids: {
    type: DataTypes.ADataTypes.STRING,
    allowNull: false
  },
  spotify_image_uri: {
    type: DataTypes.DATEONLY,
  },
  popularity: {
    type: DataTypes.INTEGER,
  }
});

const Artist = sequelize.define("artists", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  tracks: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
});

sequelize.sync().then(() => {
  console.log('Spotify tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

 module.exports = sequelize;
