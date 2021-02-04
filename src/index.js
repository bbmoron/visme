import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Home } from './components/Home/Home';
import { Tickets } from './components/Tickets/Tickets';

ReactDOM.render(<Router>
  <Switch>
    <Route path="/tickets/:airport/:citizenship/:to/:back" component={Tickets} />
    { /* <Route path="/tickets/:citizenship" component={Tickets} /> */}
    <Route exact path="/" component={Home} />
  </Switch>
</Router>, document.getElementById('root'));
