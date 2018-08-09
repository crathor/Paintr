import React, { Component, Fragment } from 'react'
import Joystick from './Joystick'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Players } from '../../../api/players'
import './styles.css'

class Controller extends Component {
  state = {
    playerCreated: false,
    name: ''
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
      }
    )
  }
  render() {
    const { player } = this.props
    const { playerCreated } = this.state
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        {playerCreated ? (
          <Fragment>
            <h1>{player.name}</h1>
            <p>{player.boost && 'Boost!'}</p>
            <p>{player.frozen && 'Frozen!'}</p>
            <Joystick />
          </Fragment>
        ) : (
          <div className="rainbowBackground formBackground">
            <h1 className="gameTitle">paintr</h1>
            <form className="formContainer" onSubmit={this.handleSubmit}>
              <input
                className="nameInput"
                placeholder="Enter Name"
                type="text"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <input className="nameSubmit" type="submit" value="Submit" />
              {/* <button className="nameSubmit" type="submit" value="Submit" /> */}
            </form>
          </div>
        )}
      </div>
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('player')
  return {
    player: Players.find({}).fetch()
  }
})(Controller)
