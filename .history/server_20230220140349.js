const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const Logger = require('koa-logger');
var querystring = require('querystring');
var request = require('request'); 
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const { Artist, Track} = require('./models/spotify_db');
const axios = require('axios');
const koaSwagger = require('koa2-swagger-ui');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-dist');
const swaggerUI2 = require('swagger-ui')

const app = new Koa();
const router = new Router();

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';



app.use(cors());
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Spotify API',
        version: '1.0.0',
        description: 'Spotify API to pull in tracks and the artists from Spotify and save them in a db to be referenced.'
      },
      servers: [
        { url: 'http://localhost:3001' }
      ]
    },
    apis: ['server.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

// app.use(router.get('/swagger', async (ctx) => {
//     ctx.body = swaggerUi.generateHTML({
//       spec: swaggerSpec,
//       swaggerOptions: {
//         docExpansion: 'none',
//         defaultModelsExpandDepth: -1
//       }
//     });
//   }));
// app.use(router.get('/swagger-ui', async (ctx) => {
//     ctx.type = 'html';
//     ctx.body = swaggerUi.getIndexHtml();
// }));
  
  

router.get('/', async (ctx) => {
    var access_token = ctx.query.access_token;
    var refresh_token = ctx.query.refresh_token;
    if (refresh_token && access_token) {
        ctx.body = {
            client: process.env.CLIENT_ID,
            LOGIN_URL: 'localhost:3001/login',
            access_token: access_token,
            refresh_token: refresh_token
        }
    }
    else {
        ctx.body = {
            client: process.env.CLIENT_ID,
            LOGIN_URL: 'localhost:3001/login'   
        }
    }
});


router.get('/login', async (ctx) => {
    var state = generateRandomString(16);
    ctx.cookies.set('stateKey', state);
    ctx.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: process.env.SCOPES,
      redirect_uri: process.env.REDIRECT_URI,
      state: state
    }));
});

router.get('/ready', async (ctx) => {
    var access_token = localStorage.getItem('access_token');
    var refresh_token = localStorage.getItem('refresh_token');
    console.log("TOKENS", access_token, refresh_token);
    ctx.body = {
        client: process.env.CLIENT_ID,
        access_token: access_token,
        refresh_token: refresh_token
    }
        
});

router.get('/callback', async (ctx) => {
 // your application requests refresh and access tokens
  // after checking the state parameter
  console.log('CALLBACK CALLED', ctx.cookies.get('stateKey'));
  var code = ctx.query.code || null;
  var state = ctx.query.state || null;
  var storedState = ctx.cookies ? ctx.cookies.get('stateKey') : null;


  if (state === null || state !== storedState) {
    ctx.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    ctx.cookies.set('stateKey', null);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true,
      method: 'POST'
    };


    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // normally store in db connected to user
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
      } 
    });
    if (localStorage.getItem('refresh_token') && localStorage.getItem('access_token')) {
        ctx.redirect('/ready')
    }
    else {
        ctx.redirect('/#' +
        querystring.stringify({
            error: 'invalid_token'
        }));
    }
  }
});

router.get('/refresh_token', async (ctx) => {
    // requesting access token from refresh token
    const refresh_token = localStorage.getItem('refresh_token');
    console.log('Refresh called');
    const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
    data: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    },
    method: 'post',
    };

    try {
        const response = await axios(authOptions);
        const body = response.data;
        if (response.status === 200 && !body.error) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        }
        ctx.body = {
            status: 'Refresh token called to reset access token.'
        };
    } 
    catch (error) {
        console.error('Error:', error);
        ctx.body = {
            status: error.response.data.error
        };
    }

});


router.get('/isrc/:id', async (ctx) => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    var statusMsg = ''
    console.log('ISRC CALLED');
    
    const options = {
      url: 'https://api.spotify.com/v1/search?q=isrc:' + ctx.params.id + '&type=track',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    
    try {
      const response = await axios.get(options.url, { headers: options.headers });
      const body = response.data;    
      if (body.error) {
        console.log('ERROR:', body.error, 'REFRESH TOKEN:', refresh_token);
        statusMsg = body.error;
        if (refresh_token !== undefined) {
          console.log('refresh token called')
          ctx.redirect('/refresh_token');
        }
        return statusMsg;
      }
      else if (body.tracks.items.length !== 0) {
        console.log('track adding hit...')
        var [isrc, trackName, artistList, spotifyImageUri, popularity] = parseTrackMetaData(body);
        statusMsg = await saveTrackToDB(isrc, trackName, artistList, spotifyImageUri, popularity)
      }
      else {
        statusMsg = "Did not find track from isrc - " + ctx.params.id
      }
      ctx.body = {
        statusMsg: statusMsg
      };
    } catch (error) {
      console.error('Error:', error);
      ctx.body = {
        statusMsg: error.response.data.error
      };
    }
 
});

router.post('/searchTitle', async (ctx) => {
    var access_token = localStorage.getItem('access_token');
    var refresh_token = localStorage.getItem('refresh_token');
    var {title} = ctx.request.query;
    if (title == null) {
        ctx.body = {
            Error: "Missing the 'title' parameter of track in searchTitle endpoint."
        }
        return;
    }
    var statusMsg = '';
    title.replaceAll(' ', '%20');
    console.log('TITLE CALLED')
    // var statusMsg = ''
    var options = {
        url: 'https://api.spotify.com/v1/search?q=title%3A' + title + '&type=track',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    }
    try {
        const response = await axios.get(options.url, { headers: options.headers });
        const body = response.data;    
        if (body.error) {
            console.log('ERROR:', body.error, 'REFRESH TOKEN:', refresh_token);
            statusMsg = body.error;
            if (refresh_token !== undefined) {
                console.log('refresh token called')
                ctx.redirect('/refresh_token');
            }
            return statusMsg;
        }
        else if (body.tracks.items.length !== 0) {
            var [isrc, trackName, artistList, spotifyImageUri, popularity] = parseTrackMetaData(body);
            statusMsg = await saveTrackToDB(isrc, trackName, artistList, spotifyImageUri, popularity)
        }
        else {
            statusMsg = "Did not find track from title - " + ctx.params.title
        }
        ctx.body = {
            statusMsg: statusMsg
        };
    } 
        catch (error) {
            console.error('Error:', error);
            ctx.body = {
                statusMsg: error.response.data.error
            };
    }
});

router.get('/getTrack/:isrc', async (ctx) => {
    const track = await Track.findOne({
        where: {
            isrc: ctx.params.isrc
        },
        include: Artist
    })
    if (track) {
        ctx.body = track;
    }
    else {
        ctx.body =  {error: 'Failed to get track.'};
    }
});

router.get('/getTracksByArtist', async (ctx) => {
    const { artist } = ctx.request.query;
    const tracks = await Track.findAll({
        include: {
            model: Artist,
            where: { name: artist }
        }
    });
    ctx.body = tracks;
});

router.get('/getAllTracks', async (ctx) => {
    const tracks = await Track.findAll({
        include: Artist
    })
    if (tracks) {
        ctx.body = tracks;
    }
    else {
        ctx.body =  {error: 'Failed to get tracks.'};
    }
});

async function saveTrackToDB(isrc, trackName, artistList, spotifyImageUri, popularity) {
    console.log('TRACK RESULTS 2',isrc, trackName, artistList, typeof spotifyImageUri, spotifyImageUri, popularity);
    var statusMsg = '';
    const isTrack = await Track.findOne({
        where: {
          isrc: isrc
        }
    });
    if (!isTrack) {
        const newTrack = await Track.create({
            isrc: isrc,
            name: trackName,
            spotify_image_uri: spotifyImageUri,
            popularity: parseInt(popularity)
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
          
        if (newTrack) {
            // Add artists to the new track
            for (var x = 0; x < artistList.length; x++) {
              const isArtist = await Artist.findOne({
                where: {
                  id: artistList[x].id
                }
              });
              if (!isArtist) {
                const artist = await Artist.create({
                  id: artistList[x].id,
                  name: artistList[x].name,
                }).catch((error) => {
                  console.error('Failed to create a new record : ', error);
                });
                newTrack.addArtist(artist);
              } else {
                newTrack.addArtist(isArtist);
              }
            }
        }
        return `New track ${newTrack.name} was successfully added to db with isrc ${newTrack.isrc}`;

    }
    else {
        console.log('IS TRACK ALREADY')
        return `Track ${isTrack.name} already added to db with isrc ${isTrack.isrc}`;
    }
}

function parseTrackMetaData(body) {
    var index = 0;
    var popularity = 0;
    for (var i = 0; i < body.tracks.items.length; i++) {
       if (body.tracks.items[i].popularity > popularity) {
           popularity = parseInt(body.tracks.items[i].popularity);
           index = i;
       }
    }
    var trackName = body.tracks.items[index].name;
    var artistList = [];
    for (var i = 0; i < body.tracks.items[index].artists.length; i++) {
        artistList.push({'id': body.tracks.items[index].artists[i].id, 'name': body.tracks.items[index].artists[i].name});
    }
    var spotifyImageUri = body.tracks.items[index].album.images[0].url;

    console.log('TRACK RESULTS', trackName, artistList, typeof spotifyImageUri, spotifyImageUri, popularity);
    return [body.tracks.items[index].external_ids.isrc, trackName, artistList, spotifyImageUri, popularity];
}


// Development logging
app.use(Logger());

// Add routes and response to the OPTIONS requests
app.use(router.routes()).use(router.allowedMethods());

// Listen the port
app.listen(3001, () => {
  console.log('Server running on port 3001');
});