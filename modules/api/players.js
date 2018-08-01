import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const Players = new Mongo.Collection('players')

// if (Meteor.isServer) {
//   Meteor.publish('players', function todosPublication() {
//     return Players.find()
//   })
// }
const getPlayer = player => {
  return Players.findOne({ player })
}
Meteor.methods({
  // 'remove.avenger' (player) {
  //   Players.remove({ player })
  // },
  'move.up'(player) {
    const p = getPlayer(player)
    if (p.y <= 0 + p.size || !p) return
    Players.update({ player }, { $set: { y: p.y - p.speed } })
  },
  'move.down'(player) {
    const p = getPlayer(player)
    if (p.y >= 803 - p.size || !p) return
    Players.update({ player }, { $set: { y: p.y + p.speed } })
  },
  'move.left'(player) {
    const p = getPlayer(player)
    if (p.x === 0 + p.size || !p) return
    Players.update({ player }, { $set: { x: p.x - p.speed } })
  },
  'move.right'(player) {
    const p = getPlayer(player)
    if (p.x >= 969 - p.size || !p) return
    Players.update({ player }, { $set: { x: p.x + p.speed } })
  }
})
