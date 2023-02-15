const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const Logger = require('koa-logger');
const { Pool } = require('pg');

const app = new Koa();
const router = new Router();
app.use(cors());

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

router.postTrack('/:isrc', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', [`Hello, ${ctx.params.name}!`])
    ctx.body = rows[0].message;
});

router.get


// Development logging
app.use(Logger());

// Add routes and response to the OPTIONS requests
app.use(router.routes()).use(router.allowedMethods());

// Listen the port
app.listen(3001, () => {
  console.log('Server running on port 3001');
});