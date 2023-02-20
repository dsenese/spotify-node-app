# Spotify API app

This app authenticates with the spotify api to request tracks and artists to be saved to a db that then can be referenced through the local api.

## Tools Used

NodeJS, Koa, and Sequelize with a mysql db.

## Requirements

Must have a local mysql connection running and a .env file with the following perameters -

By creating a Spotify Developer account you can create a project that allows you access to the Spotify client id and secret key.

### `CLIENT_ID=$SPOTIFY_API_CLIENT_ID  
CLIENT_SECRET=$SPOTIFY_API_SECRET_KEY  
REDIRECT_URI='http://localhost:3001/callback'  
SCOPES='user-read-private user-read-email'  
DB_NAME=$DB_NAME   
DB_USER=$DB_USER  
DB_PASSWORD=$DB_PASSWORD` 

### `npm run server`

This starts the app where it will listen for the login route to be called -

http://localhost:3001/login

This route will redirect you through the Spotify portal to login with a Spotify account. After logging in the Spotify will redirect you with a callback containing the access token where you can then make requests.

## API Example Routes with Postman

https://www.postman.com/dsenese8/workspace/spotify-api/collection/8494143-1b599813-db60-409d-8aff-6ecd174228c9?action=share&creator=8494143

## Routes visualized in Swagger

http://localhost:3001/swagger

## Securing API endpoints

Authenticating the user with OAuth2 and rate limiting the amount of calls that user can make. Encrypting data being sent with TLS and using a reverse proxy on the server. Validating input and error handling to catch malicious input being sent or irregular behaviour with with API.

