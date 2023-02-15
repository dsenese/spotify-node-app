import './App.css';
import './functions/pgFunctions.js';
import './functions/spotifyFunctions.js';

function App() {
  var name = ""
  return (
    <div className="App">
      <header className="App-header">
       Spotify API App
      </header>
      <div>
        <button onClick={this.pgFunctions.getName}></button>
        <div
      </div>
    </div>
  );

  function getName() {
    console.log("Button Clicked");
    this.pgFunctions.getName();
  }
}

export default App;
