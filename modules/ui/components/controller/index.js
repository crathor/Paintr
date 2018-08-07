import React, { Component } from 'react'
import nipplejs from 'nipplejs'
import { Meteor } from 'meteor/meteor'
import './styles.css'
import {
  BRICK_COLUMNS,
  BRICK_GRID,
  BRICK_ROWS,
  BRICK_HEIGHT,
  BRICK_WIDTH
} from '../config'

class Controller extends Component {
  constructor(props) {
    super(props)
    this.joystickZone = React.createRef()
    this.manager = nipplejs.create()
    this.manager.options = {
      zone: this.joystickZone
    }
    this.direction = {}
    this.state = {
      player: {
        color: 'orange'
      }
    }
  }
  move() {
    if ('dir:up' in this.direction) Meteor.call('move.up', Meteor.userId())
    if ('dir:down' in this.direction) Meteor.call('move.down', Meteor.userId())
    if ('dir:right' in this.direction)
      Meteor.call('move.right', Meteor.userId())
    if ('dir:left' in this.direction) Meteor.call('move.left', Meteor.userId())
  }
  componentDidMount() {
    Meteor.call('add.player', 'asdf' + Math.floor(Math.random() * 1000))
    Meteor.call('get.player', Meteor.userId(), (err, res) => {
      this.setState({ player: res })
    })
    this.manager
      .on('added', (evt, nipple) => {
        nipple.on('dir:up', evt => {
          this.direction = {}
          this.direction['dir:up'] = true
        })
        nipple.on('dir:down', evt => {
          this.direction = {}
          this.direction['dir:down'] = true
        })
        nipple.on('dir:left', evt => {
          this.direction = {}
          this.direction['dir:left'] = true
        })
        nipple.on('dir:right', evt => {
          this.direction = {}
          this.direction['dir:right'] = true
        })
      })
      .on('removed', (evt, nipple) => {
        nipple.off('start move end dir plain')
        this.direction = {}
      })

    this.framesPerSecond = 30
    setInterval(this.updatePlayer.bind(this), 1000 / this.framesPerSecond)
  }
  updatePlayer() {
    this.move()
  }
  render() {
    return (
      <div
        ref={this.joystickZone}
        style={{
          background: this.state.player.color || 'purple',
          width: '100vw',
          height: '100vh'
        }}
      >
        <div id="joystick-zone" />
      </div>
    )
  }
}

export default Controller
