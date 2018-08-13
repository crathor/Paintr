import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { BRICK_COLUMNS, BRICK_ROWS } from '../ui/components/config'
import SimpleSchema from 'simpl-schema'
import { Players } from './players'

if (Meteor.isServer) {
  Meteor.publish('gameboard', () => {
    return GameBoard.find({})
  })
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
}

export const GameBoard = new Mongo.Collection('gameboard')

GameBoard.initGrid = new SimpleSchema({
  _id: String,
  index: Number
})
GameBoard.brickSchema = new SimpleSchema({
  index: Number
})

Meteor.methods({
  'update.brick'(index) {
    GameBoard.brickSchema.validate({ index })
    GameBoard.update({ index }, { $set: { powerup: true } })
  },
  'init.gameboard'(_id, index) {
    GameBoard.initGrid.validate({ _id, index })
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
    Players.schema.validate(player)
    GameBoard.update({}, { $set: { color: player.color } }, { multi: true })
  }
})
