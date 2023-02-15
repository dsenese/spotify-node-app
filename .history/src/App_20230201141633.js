import './App.css';
import React, { useState } from 'react';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';

const App = () => {
  const name = useState(() => {}))
  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={getWorld()}>GET WORLD</button>
        <p>{name}</p>
      </div>
    </div>
  );
  function getWorld() {
    console.log("Button Clicked");
    this.props.name = pgFunctions.getWorld();
  }
}



export default App;
