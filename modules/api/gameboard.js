import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

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
  'set.gameboard.color'(player) {
    GameBoard.update(
      {},
      { $set: { color: player.color } },
      { upsert: true, multi: true }
    )
  }
})
