import './App.css';
import React, { useState } from 'react';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';

const App = (props) => {
  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={getWorld()}>GET WORLD</button>
        <p>{props.name}</p>
      </div>
    </div>
  );
  function getWorld() {
    console.log("Button Clicked");
    this.props.name = pgFunctions.getWorld();
  }
}



export default App;
