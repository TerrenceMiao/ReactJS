// import logo from './logo.svg';
import './App.css';
import Users from "./Components/Users";
import AddUser from "./Components/AddUser";
import UpdateUser from "./Components/UpdateUser";
import RemoveUser from "./Components/RemoveUser";
import Errorhandling from "./Components/Errorhandling";

import Leaves from "./Components/Leaves";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <div>
        <Leaves />
        {/* <Users />
        <AddUser />
        <UpdateUser />
        <RemoveUser />
        <Errorhandling /> */}
      </div>
    </div>
  );
}

export default App;
