import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

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
  'remove.player'(player) {
    Players.remove({ player })
  },
  'set.GameDimensions'(height, width) {
    Dimensions.insert({ height, width })
  },
  'add.player'(name) {
    Players.insert({
      name,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      size: 20,
      speed: 10,
      y: 0,
      x: 0,
      player: Meteor.userId()
    })
  },
  'move.up'(player) {
    const p = getPlayer(player)
    console.log(Dimensions.find())
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
