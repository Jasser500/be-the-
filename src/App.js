import React from 'react'
import Header from "./components/common/heading/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"

import Home from "./components/home/Home"
function App() {
    return (
      <>
        <Router>
          <Header />
          <Switch>
          <Route exact path='/' component={Home} />
          </Switch>
         
        </Router>
      </>
    )
  }
  
  export default App
  

