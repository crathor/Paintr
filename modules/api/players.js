import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { GameBoard } from './gameboard'
import Konva from 'konva'
import SimpleSchema from 'simpl-schema'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_ROWS,
  PLAYER_SPEED,
  PLAYER_BOOST,
  PLAYER_SIZE,
  rowColToArrayIndex
} from '../ui/components/config'

export const Players = new Mongo.Collection('players')

Players.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  name: String,
  color: String,
  size: Number,
  speed: Number,
  y: Number,
  x: Number,
  boost: Boolean,
  frozen: Boolean,
  player: String
})

if (Meteor.isServer) {
  Meteor.publish('players', () => {
    return Players.find({})
  })
  Meteor.publish('player', () => {
    return Players.find({ player: Meteor.userId() })
  })
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
}
const checkPlayers = () => {
  return Players.find({}).count()
}
const getPlayer = player => {
  return Players.findOne({ player })
}
const checkCollision = player => {
  if (player) {
    const playerBrickCol = Math.floor(player.x / BRICK_WIDTH)
    const playerBrickRow = Math.floor(player.y / BRICK_HEIGHT)
    const brickIndex = rowColToArrayIndex(playerBrickCol, playerBrickRow)
    const brick = GameBoard.find({ index: brickIndex }).fetch()
    if (brick[0].powerup) {
      if (!player.boost) {
        const power = Math.floor(Math.random() * 15)
        switch (power) {
          case 7:
            Meteor.call('freeze.players', player)
            break
          case 2:
            Meteor.call('freeze.players', player)
            break
          case 11:
            Meteor.call('freeze.players', player)
            break
          case 8:
            Meteor.call('set.gameboard.color', player)
            break
          case 9:
            Meteor.call('reset.gameboard')
            break

          default:
            Meteor.call('boost.player', player)
            break
        }
        GameBoard.update({ index: brickIndex }, { $set: { powerup: false } })
      }
    }
    if (brickIndex >= 0 && brickIndex < BRICK_COLUMNS * BRICK_ROWS) {
      GameBoard.update({ index: brickIndex }, { $set: { color: player.color } })
    }
  }
}
const removeBoost = player => {
  Meteor.setTimeout(() => {
    Meteor.call('remove.boost', player)
  }, 5000)
}
const unFreezePlayers = () => {
  Meteor.setTimeout(() => {
    Meteor.call('unfreeze.players')
  }, 5000)
}
Meteor.methods({
  'reset.players'() {
    Players.remove({})
  },
  'reset.player.speed'() {
    Players.update({}, { $set: { speed: PLAYER_SPEED } }, { multi: true })
  },
  'freeze.players'(player) {
    Players.update(
      { color: { $ne: player.color } },
      { $set: { speed: 0, frozen: true } },
      {
        multi: true
      }
    )
    unFreezePlayers()
  },
  'unfreeze.players'() {
    Players.update(
      {},
      { $set: { speed: PLAYER_SPEED, frozen: false } },
      { multi: true }
    )
  },
  'remove.player'(player) {
    Players.remove({ player })
  },
  'add.player'(name) {
    if (checkPlayers() >= 4) return Meteor.Error({ message: 'Max Players Hit' })
    const newPlayer = {
      name,
      color: Konva.Util.getRandomColor(),
      size: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      y: Math.floor(1 + Math.random() * GAME_HEIGHT),
      x: Math.floor(1 + Math.random() * GAME_WIDTH),
      boost: false,
      frozen: false,
      player: Meteor.userId()
    }
    Players.schema.validate(newPlayer)
    Players.insert(newPlayer)
  },
  'boost.player'(player) {
    Players.schema.validate(player)
    Players.update(player._id, { $set: { speed: PLAYER_BOOST, boost: true } })
    removeBoost(player)
  },
  'remove.boost'(player) {
    Players.schema.validate(player)
    Players.update(player._id, {
      $set: { speed: PLAYER_SPEED, boost: false }
    })
  },
  'move.up'(player) {
    const p = getPlayer(player)
    //Players.schema.validate(p)
    if (p.y <= 0 + p.speed) return
    else {
      Players.update({ player }, { $set: { y: p.y - p.speed } })
      checkCollision(p)
    }
  },
  'move.down'(player) {
    const p = getPlayer(player)
    //Players.schema.validate(p)
    if (p.y >= GAME_HEIGHT - p.speed) return
    else {
      Players.update({ player }, { $set: { y: p.y + p.speed } })
      checkCollision(p)
    }
  },
  'move.left'(player) {
    const p = getPlayer(player)
    //Players.schema.validate(p)
    if (p.x <= 0 + p.speed) return
    else {
      Players.update({ player }, { $set: { x: p.x - p.speed } })
      checkCollision(p)
    }
  },
  'move.right'(player) {
    const p = getPlayer(player)
    //Players.schema.validate(p)
    if (p.x >= GAME_WIDTH - p.speed) return
    else {
      Players.update({ player }, { $set: { x: p.x + p.speed } })
      checkCollision(p)
    }
  }
})
