import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const Players = new Mongo.Collection('players')

// if (Meteor.isServer) {
//   Meteor.publish('players', function todosPublication() {
//     return Players.find()
//   })
// }

Meteor.methods({
  // 'remove.avenger' (player) {
  //   Players.remove({ player })
  // },
  'move.up'(player) {
    Players.update(
      { player },
      { $set: { y: Players.findOne({ player }).y - 10 } }
    )
  },
  'move.down'(player) {
    Players.update(
      { player },
      { $set: { y: Players.findOne({ player }).y + 10 } }
    )
  },
  'move.left'(player) {
    Players.update(
      { player },
      { $set: { x: Players.findOne({ player }).x - 10 } }
    )
  },
  'move.right'(player) {
    Players.update(
      { player },
      { $set: { x: Players.findOne({ player }).x + 10 } }
    )
  }
})
