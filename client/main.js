import React from 'react'
import ReactDOM from 'react-dom'
import App from '../modules/ui/containers/App'
import './main.html'
import { Meteor } from 'meteor/meteor'

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
