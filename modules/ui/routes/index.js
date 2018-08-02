import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Controller from '../components/Controller'
import LandingPage from '../components/LandingPage'
import Game from '../components/Game'

export default () => (
  <Switch>
    <Route exact path="/welcome" component={LandingPage} />
    <Route exact path="/controller" component={Controller} />
    <Route exact path="/game" component={Game} />
    <Redirect to="/welcome" />
  </Switch>
)
