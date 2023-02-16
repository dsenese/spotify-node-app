# Spotify API app

This app authenticates with the spotify api to request tracks and artists to be saved to a db that then can be referenced through the local api.

## Tools used

NodeJS, Koa, and Sequelize with a mysql db.

## Requirements

Must have a local mysql connection running and a .env file with the following perameters -

By creating a Spotify Developer account you can create a project that allows you access to the Spotify client id and secret key.

### `CLIENT_ID=$SPOTIFY_API_CLIENT_ID /n
CLIENT_SECRET=$SPOTIFY_API_SECRET_KEY /n
REDIRECT_URI='http://localhost:3001/callback' /n
SCOPES='user-read-private user-read-email'/n
DB_NAME=$DB_NAME /n
DB_USER=$DB_USER /n
DB_PASSWORD=$DB_PASSWORD` 

### `npm run server`

This starts the app where it will listen for the login route to be called -

http://localhost:3001/login

This route will redirect you through the Spotify portal to login with a Spotify account. After logging in the Spotify will redirect you with a callback containing the access token where you can then make requests.



