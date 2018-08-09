import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { GameBoard } from './gameboard'
import Konva from 'konva'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_ROWS,
  PLAYER_SPEED,
  PLAYER_BOOST,
  rowColToArrayIndex
} from '../ui/components/config'

export const Players = new Mongo.Collection('players')

if (Meteor.isServer) {
  Meteor.publish('players', () => {
    return Players.find({})
  })
  Meteor.publish('player', () => {
    return Players.findOne({ player: Meteor.userId() })
  })
  AccountsGuest.enabled = true
  AccountsGuest.anonymous = true
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
        const power = Math.floor(Math.random() * 10)
        switch (power) {
          case 7:
            Meteor.call('freeze.players', player)
            Meteor.call('unfreeze.players')
            break
          case 8:
            Meteor.call('set.gameboard.color', player)
            break
          case 9:
            Meteor.call('reset.gameboard')
            break

          default:
            Meteor.call('boost.player', player)
            Meteor.call('remove.boost', player)
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
Meteor.methods({
  'reset.players'() {
    Players.remove({})
  },
  'reset.player.speed'() {
    Players.update({}, { $set: { speed: PLAYER_SPEED } }, { multi: true })
  },
  'get.player'(id) {
    return getPlayer(id)
  },
  'freeze.players'(player) {
    Players.update(
      { color: { $ne: player.color } },
      { $set: { speed: 0, frozen: true } },
      {
        multi: true
      }
    )
  },
  'unfreeze.players'() {
    Meteor.setTimeout(() => {
      Players.update(
        {},
        { $set: { speed: 10, frozen: false } },
        { multi: true }
      )
    }, 5000)
  },
  'remove.player'(player) {
    Players.remove({ player })
  },
  'add.player'(name) {
    Players.insert({
      name,
      color: Konva.Util.getRandomColor(),
      size: 10,
      speed: PLAYER_SPEED,
      y: Math.floor(1 + Math.random() * GAME_HEIGHT),
      x: Math.floor(1 + Math.random() * GAME_WIDTH),
      boost: false,
      frozen: false,
      player: Meteor.userId()
    })
  },
  'boost.player'(player) {
    Players.update(player._id, { $set: { speed: PLAYER_BOOST, boost: true } })
  },
  'remove.boost'(player) {
    Meteor.setTimeout(() => {
      Players.update(player._id, {
        $set: { speed: PLAYER_SPEED, boost: false }
      })
    }, 5000)
  },
  'move.up'(player) {
    const p = getPlayer(player)
    if (p.y <= 0 + p.speed) return
    else {
      Players.update({ player }, { $set: { y: p.y - p.speed } })
      checkCollision(p)
    }
  },
  'move.down'(player) {
    const p = getPlayer(player)
    if (p.y >= GAME_HEIGHT - p.speed) return
    else {
      Players.update({ player }, { $set: { y: p.y + p.speed } })
      checkCollision(p)
    }
  },
  'move.left'(player) {
    const p = getPlayer(player)
    if (p.x <= 0 + p.speed) return
    else {
      Players.update({ player }, { $set: { x: p.x - p.speed } })
      checkCollision(p)
    }
  },
  'move.right'(player) {
    const p = getPlayer(player)
    if (p.x >= GAME_WIDTH - p.speed) return
    else {
      Players.update({ player }, { $set: { x: p.x + p.speed } })
      checkCollision(p)
    }
  }
})
