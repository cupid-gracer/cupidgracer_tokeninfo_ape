import React from "react";
import "./App.css";
import Header from "./components/header/Header";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Util from "./util/util";

const util = new Util();

function App() {
  return (
    <Router className="App">
      <NotificationContainer />
      <Header util={util}/>
      <Switch>
        <Route exact  path={`/`} component={Home}/>
        <Route path={`/token/:tokenAddress`}>
          <Dashboard  util={util}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
