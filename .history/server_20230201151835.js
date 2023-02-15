const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const Logger = require('koa-logger');
var cookieParser = require('cookie-parser');
const { Pool } = require('pg');

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
app.use(cookieParser());

app.pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'italiano08',
    port: 5432, 
  });

 
router.get('/', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', ['Hello, World!'])
    ctx.body = rows[0].message;
});

router.get('/:name', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', [`Hello, ${ctx.params.name}!`])
    ctx.body = rows[0].message;
});

router.get('/login', async (ctx) => {
    var state = generateRandomString(16);
    ctx.c
    ctx.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.post('/isrc/:id', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', [`Hello, ${ctx.params.name}!`])
    ctx.body = rows[0].message;
});

router.get('/isrc/:id', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', [`Hello, ${ctx.params.name}!`])
    ctx.body = rows[0].message;
});

router.get('/artist/:artist', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', [`Hello, ${ctx.params.name}!`])
    ctx.body = rows[0].message;
});

router.





// Development logging
app.use(Logger());

// Add routes and response to the OPTIONS requests
app.use(router.routes()).use(router.allowedMethods());

// Listen the port
app.listen(3001, () => {
  console.log('Server running on port 3001');
});