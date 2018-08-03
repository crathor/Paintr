import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import Konva from 'konva'
export const Players = new Mongo.Collection('players')

if (Meteor.isServer) {
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
  Players.remove({})
}

const getPlayer = player => {
  return Players.findOne({ player })
}

Meteor.methods({
  'reset.players'() {
    Players.remove({})
  },
  'get.player'(id) {
    return getPlayer(id)
  },
  'remove.player'(player) {
    Players.remove({ player })
  },
  'add.player'(name) {
    Players.insert({
      name,
      color: Konva.Util.getRandomColor(),
      size: 20,
      speed: 10,
      y: 0,
      x: 0,
      player: Meteor.userId()
    })
  },
  'move.up'(player) {
    const p = getPlayer(player)
    if (p.y <= 0 + p.size || !p) return
    Players.update({ player }, { $set: { y: p.y - p.speed } })
  },
  'move.down'(player, height) {
    const p = getPlayer(player)
    if (p.y >= height - p.size || !p) return
    Players.update({ player }, { $set: { y: p.y + p.speed } })
  },
  'move.left'(player) {
    const p = getPlayer(player)
    if (p.x <= 0 + p.size || !p) return
    Players.update({ player }, { $set: { x: p.x - p.speed } })
  },
  'move.right'(player, width) {
    const p = getPlayer(player)
    if (p.x >= width - p.size || !p) return
    Players.update({ player }, { $set: { x: p.x + p.speed } })
  }
})
