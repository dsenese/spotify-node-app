const {Sequelize, DataTypes} = require("sequelize");
const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USER,
 process.env.DB_PASSWORD,
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
  }
});

const ArtistTrack = sequelize.define('artist_track', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artistId: {
    type: DataTypes.STRING,
    references: {
      model: 'artists',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  trackIsrc: {
    type: DataTypes.STRING,
    references: {
      model: 'tracks',
      key: 'isrc'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
});

Artist.belongsToMany(Track, { through: ArtistTrack });
Track.belongsToMany(Artist, { through: ArtistTrack });


sequelize.sync().then(() => {
  console.log('Spotify tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

 module.exports = {sequelize, Artist, Track, ArtistTrack};
