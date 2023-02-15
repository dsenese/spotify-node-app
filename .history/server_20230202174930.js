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
// const db = require('../models');


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

        var options = {
            url: 'https://api.spotify.com/v1/search?q=isrc:USWB11403680&type=track',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            console.log(body);
        });  
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
    var refresh_token = localStorage.getItem('refresh_token');
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        ctx.send({
          'access_token': access_token
        });
      }
    });
  });

// router.get('/searchSong/:title', async (ctx) => {
//     request.get(authOptions)
// })

router.get('/isrc/:id', async (ctx) => {
    var access_token = localStorage.getItem('access_token');
    var refresh_token = localStorage.getItem('refresh_token');
    console.log('ISRC CALLED')
    var options = {
        url: 'https://api.spotify.com/v1/search?q=isrc:' + ctx.params.id + '&type=track',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    }
    request.get(options, function(error, response, body) {
        //save to db
        var index = 0;
        var popularity = 0;
        if (error) {
            console.log(error);
            if (refresh_token !== undefined) {
                ctx.redirect('/refresh_token');
            }
            else {
                ctx.redirect('/login');
            }
        }
        for (var i = 0; i < body.tracks.items.length; i++) {
           if (body.tracks.items[i].popularity > popularity) {
               popularity = body.tracks.items[i].popularity;
               index = i;
           }
        }
        var trackName = body.tracks.items[index].name;
        var are
        for (var i = 0; i < body.tracks.items[index].artists.length; i++) {
            
        }
        var artistList = body.tracks.items[index].artists;
        console.log(body);
    })
    ctx.body = {
        status: 'successfully added track - ' + ctx.params.id
    }
 
});

router.post('/searchTitle/:title', async (ctx) => {
    var access_token = localStorage.getItem('access_token');
    var refresh_token = localStorage.getItem('refresh_token');
    console.log('ISRC CALLED')
    var options = {
        url: 'https://api.spotify.com/v1/search?q=title:' + ctx.params.title + '&type=track',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    }
    request.get(options, function(error, response, body) {
        //save to db
        if (error) {
            console.log(error);
            if (refresh_token !== undefined) {
                ctx.redirect('/refresh_token');
            }
            else {
                ctx.redirect('/login');
            }
        }

        for (var i = 0; i < body.tracks.items.length; i++) {
            console.log(body.tracks.items[i].name);
        }
        console.log(body);
    })
    ctx.body = {
        status: 'successfully added track.'
    }
});

router.get('/isrc/:id', async (ctx) => {
});

router.get('/artist/:artist', async (ctx) => {

});



// Development logging
app.use(Logger());

// Add routes and response to the OPTIONS requests
app.use(router.routes()).use(router.allowedMethods());

// Listen the port
app.listen(3001, () => {
  console.log('Server running on port 3001');
});