import React from 'react';
import Header from "./components/common/header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes from react-router-dom
import "./App.css";
import About from "./components/about/About";
import Home from "./components/home/Home";
import Login from "./inscription/Login";
import Inscription from "./inscription/Inscription";
import Cour from "./components/cour/Cour";
import Courses from "./components/courses/Courses";
import Anglais from "./components/langue/Anglais";
import Sidebar from "./components/admin/Sidebar";
import Vision from "./components/video/Vision";
import Users from "./components/admin/Users";
import Contact from "./components/contact/Contact";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/anglais" element={<Anglais />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/users" element={<Users />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cour" element={<Cour />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
