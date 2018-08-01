import React, { Component } from 'react'
import { Circle } from 'react-konva'

class Player extends Component {
  render() {
    const { player } = this.props
    return (
      <Circle
        x={player.x}
        y={player.y}
        radius={player.size}
        fill={player.color}
        stroke={player.color}
      />
    )
  }
}

export default Player
