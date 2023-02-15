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
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isrc: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

const ArtistTrack = sequelize.define('ArtistTrack', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artist_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Artist',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  track_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Track',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
});


sequelize.sync().then(() => {
  console.log('Spotify tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

 module.exports = {sequelize, Artist, Track};
