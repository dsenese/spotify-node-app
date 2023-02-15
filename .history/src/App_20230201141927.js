import './App.css';
import React, { useState } from 'react';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';

const App = () => {
  const [name, setName] = useState("none");

  const getName = async () => {
    setName(pgFunctions.getWorld())
  }

  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={getName}>GET WORLD</button>
        <p>{name}</p>
      </div>
    </div>
  );
}



export default App;
