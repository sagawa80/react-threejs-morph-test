import React, {useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';

import Navbar from './Navbar';
import Home from './Home';
import Sphere from './Sphere';
import Twist from './Twist';
import WebglBG from './WebglBG';

function App() {
  const [currentState, setState] = useState("none");
  const fromHomeNotice = () => {
    setState("home");
    //console.log("Home End");
  };
  const fromSphereNotice = () => {
    setState("sphere");
    //console.log("Sphere End");
  };
  return (
    <div className="App">
      <BrowserRouter>
        <header className="header">
          <h1>REACT TEST</h1>
          <Navbar />
        </header>
        <div className="content-main">
          <Switch>
            <Route exact path='/'>
              <Home currentState={currentState} />
            </Route>
            <Route exact path='/sphere'>
              <Sphere currentState={currentState} />
            </Route>
            <Route exact path='/twist'>
              <Twist currentState={currentState} />
            </Route>
          </Switch>
        </div>
        <div className="webgl-bg">
          <WebglBG fromHomeNotice={fromHomeNotice} fromSphereNotice={fromSphereNotice}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
