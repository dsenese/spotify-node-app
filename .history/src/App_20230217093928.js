import './App.css';
import React, { useEffect, useState } from 'react';
import store from 'store-js';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';


const App = () => {
  const [name, setName] = useState("none");

  const getName = async () => {
    var tempName = await pgFunctions.getWorld();
    console.log(tempName);
    setName(tempName);
  }


  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
       <div>
        <button onClick={getName}>GET WORLD</button>
        <p>{name}</p>
      </div>
      </header>
      
    </div>
  );
}



export default App;
