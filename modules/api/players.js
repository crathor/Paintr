import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import Konva from 'konva'
import { GAME_WIDTH, GAME_HEIGHT } from '../ui/components/config'
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
      size: 15,
      speed: 10,
      y: 0,
      x: 0,
      player: Meteor.userId()
    })
  },
  'move.up'(player) {
    const p = getPlayer(player)
    if (p.y <= 0) Players.update({ player }, { $set: { y: GAME_HEIGHT } })
    else Players.update({ player }, { $set: { y: p.y - p.speed } })
  },
  'move.down'(player) {
    const p = getPlayer(player)
    if (p.y >= GAME_HEIGHT) Players.update({ player }, { $set: { y: 0 } })
    else Players.update({ player }, { $set: { y: p.y + p.speed } })
  },
  'move.left'(player) {
    const p = getPlayer(player)
    if (p.x <= 0) Players.update({ player }, { $set: { x: GAME_WIDTH } })
    else Players.update({ player }, { $set: { x: p.x - p.speed } })
  },
  'move.right'(player) {
    const p = getPlayer(player)
    if (p.x >= GAME_WIDTH - p.size || !p)
      Players.update({ player }, { $set: { x: 0 } })
    else Players.update({ player }, { $set: { x: p.x + p.speed } })
  }
})
