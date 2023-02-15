import './App.css';
import './functions/pgFunctions.js';
import './functions/spotifyFunctions.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={pgFunctions}></button>
      </div>
    </div>
  );
}

export default App;
