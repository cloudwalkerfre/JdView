import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import stateManager from './container/stateManager';
import Container from './container/container';

import JdetailPage from './component/detailPage';
import Jpic from './component/pic';
import Jpage from './component/page';
import Jooxx from './component/ooxx';

const StateManager = new stateManager();

const routes = (
  <Provider stateM={StateManager}>
    <Router history={browserHistory}>
      <Route component={Container} >
        <Route path="page" component={{main: Jpage}} />
        <Route path="detail/:id" component={{main: JdetailPage}} />
        <Route path="pic" component={{main: Jpic}}/>
        <Route path="ooxx" component={{main: Jooxx}}/>
        <Route path="*" component={{main: Jpage}}/>
      </Route>
    </Router>
  </Provider>
)

ReactDOM.render(routes, document.querySelector('#root'));
