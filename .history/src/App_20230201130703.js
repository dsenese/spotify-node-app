import './App.css';
import pgFunctions from './functions/pgFunctions'; './functions/pgFunctions.js';
import  './functions/spotifyFunctions.js';

function App() {
  var name = ""
  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={getWorld()}></button>
        <p>{name}</p>
      </div>
    </div>
  );

  function getWorld() {
    console.log("Button Clicked");
    name = pgFunctions.getWorld();
  }
}

export default App;
