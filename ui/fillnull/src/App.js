import React from 'react';
import LandingPage from "./landing-page";
import {BrowserRouter} from 'react-router-dom'
import './App.css'


function App() {

  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LandingPage/>

      </BrowserRouter>
  );
}

export default App;
