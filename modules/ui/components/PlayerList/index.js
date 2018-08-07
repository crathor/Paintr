import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { BRICK_COLUMNS, BRICK_ROWS } from '../config'

class PlayerList extends Component {
  getCountPercentage(count, arrayLength) {
    const percentage = (count * 100) / arrayLength
    return percentage.toFixed(1)
  }
  render() {
    const { players, bricks } = this.props
    const brickColors = bricks.map(brick => brick.color)
    const playerList = players
      .map(player => {
        const count = brickColors.filter(color => color === player.color).length
        return {
          ...player,
          count
        }
      })
      .sort((a, b) => a.count < b.count)
    return (
      <ul>
        {playerList
          .map(player => {
            return (
              <li
                key={player._id}
                style={{
                  background: player.color,
                  color: '#fff'
                }}
              >
                <h3>name: {player.name}</h3>
                <p>speed: {player.speed}</p>
                <p>size: {player.size}</p>
                <p>
                  Count: {this.getCountPercentage(player.count, bricks.length)}%
                </p>
                <button onClick={() => Meteor.call('boost.player', player)}>
                  speed
                </button>
              </li>
            )
          })
          .sort((a, b) => a.speed > b.speed)}
      </ul>
    )
  }
}

export default PlayerList
