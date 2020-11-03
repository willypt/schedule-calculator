import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Landing from './Views/Landing';

const routes = () => (
  <Switch>
    <Route exact path="/" component={Landing} />
  </Switch>
);

export default routes;
