import React, { Component } from 'react'
import { Circle } from 'react-konva'

class Player extends Component {
  state = {
    x: 100,
    y: 100,
    speed: 10,
    size: 0.01
  }
  render() {
    const { player } = this.props
    console.log(player)
    return (
      <Circle
        x={player.x}
        y={player.y}
        radius={window.innerHeight * player.size}
        fill={player.color}
        stroke="black"
      />
    )
  }
}

export default Player
