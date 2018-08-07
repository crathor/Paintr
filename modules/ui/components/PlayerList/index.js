import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

class PlayerList extends Component {
  render() {
    const { players, bricks } = this.props
    console.log(bricks)
    // console.log(bricks.filter(brick => brick.color === players[0].color))
    return (
      <ul>
        {players.map(player => {
          if (player.powerup.reverse) {
            setTimeout(() => {
              Meteor.call('reset.player.reverse', player)
            }, 5000)
          }
          if (player.powerup.speed) {
            setTimeout(() => {
              Meteor.call('reset.player.speed', player)
            }, 5000)
          }
          return (
            <li
              key={player._id}
              style={{ background: player.color, color: '#fff' }}
            >
              <h3>name: {player.name}</h3>
              <p>speed: {player.speed}</p>
              <p>{player.powers.join(',')}</p>
              <p>size: {player.size}</p>
              <button onClick={() => Meteor.call('boost.player', player)}>
                speed
              </button>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PlayerList
