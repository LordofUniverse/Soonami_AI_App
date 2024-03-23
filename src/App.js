import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import Home from './pages/home';
import CreateProject from './pages/createproject';
import Login from './pages/login';
import Project from './pages/project';

import './App.css';

function App() {

  return (
    <Router>
        <Routes>
          <Route exact path="/" element= {<Home />} />
          <Route exact path="/createproject" element= {<CreateProject />} />
          <Route exact path="/project" element= {<Project />} />
          <Route exact path="/login" element= {<Login />} />
        </Routes>
    </Router>
  );
}

export default App;