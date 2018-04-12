import React from 'react';
import ReactDOM from 'react-dom';
import './landing.css';
import './test.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Landing from './Landing';
import Main from './Main';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Landing} />
      <Route exact path="/main" component={Main} />
    </div>
  </Router>,
  document.getElementById('root')
)

registerServiceWorker();
