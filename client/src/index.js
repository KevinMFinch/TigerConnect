import React from 'react';
import ReactDOM from 'react-dom';
import './landing.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Landing from './Landing';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Landing} />
    </div>
  </Router>,
  document.getElementById('root')
)
registerServiceWorker();
