import './App.css';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';

function App(props) {
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
}



export default App;
