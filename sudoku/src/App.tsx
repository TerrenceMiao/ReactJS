import './sudoku';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container"></div>

      <div id="controls">
        <button type="button" className="btn primary" data-action="newGame">New Game</button>
        <button type="button" className="btn primary" data-action="solve">Solve</button>
        <button type="button" className="btn primary" data-action="validate">Validate</button>
      </div>
    </div>
  );
}

export default App;
