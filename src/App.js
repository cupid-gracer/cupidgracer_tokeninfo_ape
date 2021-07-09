import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router className="App">
      <Header/>
      <Dashboard/>
    </Router>
  );
}

export default App;
