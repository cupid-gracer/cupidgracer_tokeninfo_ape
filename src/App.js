import React from 'react'
import './App.css';
import Header from './components/header/Header';
import Dashboard from './components/dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  // let match = useRouteMatch();
  return (
    <Router className="App">
      <Header/>
      <Switch>
        <Route path={`/token/:tokenAddress`}>
          <Dashboard/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
