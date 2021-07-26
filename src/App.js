import React from "react";
import "./App.css";
import Header from "./components/header/Header";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  // let match = useRouteMatch();
  return (
    <Router className="App">
      <NotificationContainer />
      <Header />
      <Switch>
        <Route exact  path={`/`} component={Home}/>
        <Route path={`/token/:tokenAddress`}>
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
