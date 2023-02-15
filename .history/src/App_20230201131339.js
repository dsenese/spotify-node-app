import './App.css';
import pgFunctions from './functions/pgFunctions';
import spotifyFunctions from './functions/spotifyFunctions.js';

function App() {
  render(){

  }
 

}
function getWorld() {
    console.log("Button Clicked");
    name = pgFunctions.getWorld();
  }

export default App;
