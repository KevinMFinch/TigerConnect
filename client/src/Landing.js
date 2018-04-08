import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';
import logo from './images/tclogo.png';

class Landing extends Component {

  // renders the landing page
  render() {
    return (
        <header>
            <h1>TigerConnect</h1>
            <br />
            <img src={logo} className="logo" />
            <br /><br />
            <div id="left-side">
              <a href="#" className="landing-btn login-btn">Login</a>
            </div>
            <div id="right-side">
              <a href="#" className="landing-btn about-btn">About</a>
            </div>
        </header>
    );
  }
}

export default Landing;
