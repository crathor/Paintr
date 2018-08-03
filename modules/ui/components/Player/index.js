import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

const Player = ({ generatePlayer, player }) => {
  console.log('hello')
  return generatePlayer(player.x, player.y, player.size, player.color)
}

export default Player
// export default withTracker(() => {
//   return {
//     player: Players.findOne({ player: Meteor.userId() })
//   }
// })(Player)

// const playerBrickCol = Math.floor(this.player.x / BRICK_WIDTH)
// const playerBrickRow = Math.floor(this.player.y / BRICK_HEIGHT)
// const brickIndex = this.rowColToArrayIndex(playerBrickCol, playerBrickRow)

// if (brickIndex >= 0 && brickIndex < BRICK_COLUMNS * BRICK_ROWS) {
//   BRICK_GRID[brickIndex] = this.player.color
// }
