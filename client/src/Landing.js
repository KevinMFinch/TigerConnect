import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';
import logo from './images/tclogo.png';

class Landing extends Component {
  // puts correct body styling
  componentDidMount() {
    document.body.id = 'landing-body';
  }

  // removes the body styling when on a different page
  componentWillUnmount() {
    document.body.id = '';
  }

  // renders the landing page
  render() {
    return (
        <header className="landing-component">
            <h1>TigerConnect</h1>
            <img src={logo} className="logo" />
            <br /><br />
            <div id="left-side">
              <a href="main" className="landing-component landing-btn login-btn">Login</a>
            </div>
            <div id="right-side">
              <a href="about" className="landing-component landing-btn about-btn">About</a>
            </div>
        </header>
    );
  }
}

export default Landing;
