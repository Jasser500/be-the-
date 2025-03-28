import React from 'react';
import Header from "./components/common/header/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import About from "./components/about/About";
import Home from "./components/home/Home";
import Login from "./inscription/Login";
import Inscription from "./inscription/Inscription";
import Courses from "./components/courses/Courses";
import Anglais from "./components/langue/Anglais";
import Sidebar from "./components/admin/Sidebar";
import Vision from "./components/video/Vision"
import VideoCallComponent from './components/video/Vision';
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
            <Route exact path='/courses' component={Courses} />
            <Route exact path='/anglais' component={Anglais} />
            <Route exact path='/sidebar' component={Sidebar} />
            <Route exact path='/vision' component={Vision} />
          </Switch>
        </Router>
      </>
    );
}

export default App;
