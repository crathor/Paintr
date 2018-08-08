import React, { Component } from 'react'
import Joystick from './Joystick'
import { Meteor } from 'meteor/meteor'

class Controller extends Component {
  state = {
    playerCreated: false,
    name: '',
    player: {}
  }
  handleChange = event => {
    if (event.target.value.length > 8) return
    this.setState({ name: event.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.name === '') return
    this.setState(
      {
        playerCreated: true
      },
      async () => {
        await Meteor.call('add.player', this.state.name)
        Meteor.call('get.player', Meteor.userId(), (err, res) => {
          this.setState({ player: res })
        })
      }
    )
  }
  render() {
    const { playerCreated, player } = this.state
    return (
      <div>
        {playerCreated ? (
          <Joystick player={player} />
        ) : (
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </div>
    )
  }
}
export default Controller
