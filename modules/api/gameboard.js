import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { BRICK_COLUMNS, BRICK_ROWS } from '../ui/components/config'

if (Meteor.isServer) {
  Meteor.publish('gameboard', () => {
    return GameBoard.find({})
  })
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
}

export const GameBoard = new Mongo.Collection('gameboard')

Meteor.setInterval(() => {
  if (GameBoard.find({ powerup: true }).count() <= 3) {
    const brick = GameBoard.findOne({
      index: Math.floor(Math.random() * (BRICK_COLUMNS * BRICK_ROWS))
    })
    Meteor.call('update.brick', brick._id)
  }
}, 3000)

Meteor.methods({
  'update.brick'(_id) {
    GameBoard.update(_id, { $set: { powerup: true } })
  },
  'init.gameboard'(_id, index) {
    GameBoard.update(
      { _id },
      { $set: { index, powerup: false } },
      { upsert: true }
    )
  },
  'reset.gameboard'() {
    GameBoard.update({}, { $set: { color: '#f4f4f4' } }, { multi: true })
  },
  'set.gameboard.color'(player) {
    GameBoard.update({}, { $set: { color: player.color } }, { multi: true })
  }
})
