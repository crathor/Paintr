import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { BRICK_COLUMNS } from '../ui/components/config'

const rowColToArrayIndex = (col, row) => {
  return col + BRICK_COLUMNS * row
}

if (Meteor.isServer) {
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
}

export const GameBoard = new Mongo.Collection('gameboard')

Meteor.methods({
  'reset.gameboard'() {
    GameBoard.update(
      {},
      { $set: { color: '#f4f4f4' } },
      { upsert: true, multi: true }
    )
  },
  'activate.powerup'(player, square) {
    // apply powerup to player
    // remove powerup from grid
    // settimeout to remove powerup from player
  }
})
