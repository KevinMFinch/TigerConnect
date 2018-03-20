import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  // Initialize state
  state = { }

  // Fetch message after first mount
  componentDidMount() {
    this.getMessage();
  }

  getMessage = () => {
    // Get the message and store in state
    fetch('/api/message')
      .then(res => res.json())
      .then(message => this.setState(message));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.message}
        </p>
        <button
          className="button"
          onClick={this.getMessage}>
          Get another message
        </button>
      </div>
    );
  }
}

export default App;
