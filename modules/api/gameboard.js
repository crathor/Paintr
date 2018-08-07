import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { BRICK_COLUMNS, BRICK_ROWS } from '../ui/components/config'

if (Meteor.isServer) {
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
}

export const GameBoard = new Mongo.Collection('gameboard')

Meteor.setInterval(() => {
  if (GameBoard.find({ powerup: true }).count() <= 3) {
    const brick = GameBoard.findOne({
      index: Math.floor(Math.random() * (BRICK_COLUMNS * BRICK_ROWS))
    })
    GameBoard.update(brick._id, { $set: { powerup: true } })
  }
}, 3000)

Meteor.methods({
  'reset.gameboard'() {
    GameBoard.update(
      {},
      { $set: { color: '#f4f4f4' } },
      { upsert: true, multi: true }
    )
  },
  'set.gameboard.color'(player) {
    GameBoard.update(
      {},
      { $set: { color: player.color } },
      { upsert: true, multi: true }
    )
  }
})
