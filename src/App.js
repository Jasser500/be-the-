import React from 'react'
import Header from "./components/common/header/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import About from "./components/about/About"
import Home from "./components/home/Home"
import Login from "./inscription/Login"
import Inscription from "./inscription/Inscription"
function App() {
    return (
      <>
        <Router>
          <Header />
          <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/inscription' component={Inscription} />
          </Switch>
         
        </Router>
      </>
    )
  }
  
  export default App
  

