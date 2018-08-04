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
  rowColToArrayIndex
} from '../ui/components/config'

export const Players = new Mongo.Collection('players')

if (Meteor.isServer) {
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
      console.log('hit')
      Players.update(player._id, { $set: { speed: 20 } }, { upsert: true })
      setTimeout(() => {
        Players.update(player._id, { $set: { speed: 5 } }, { upsert: true })
      }, 2000)
    }
    if (brickIndex >= 0 && brickIndex < BRICK_COLUMNS * BRICK_ROWS) {
      GameBoard.update(
        { index: brickIndex },
        { $set: { color: player.color } },
        { upsert: true }
      )
    }
  }
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
      speed: 5,
      y: 100,
      x: 100,
      player: Meteor.userId()
    })
  },
  'move.up'(player) {
    const p = getPlayer(player)
    if (p.y <= 0) {
      Players.update({ player }, { $set: { y: GAME_HEIGHT } })
      checkCollision(p)
    } else {
      Players.update({ player }, { $set: { y: p.y - p.speed } })
      checkCollision(p)
    }
  },
  'move.down'(player) {
    const p = getPlayer(player)
    if (p.y >= GAME_HEIGHT) {
      Players.update({ player }, { $set: { y: 0 } })
      checkCollision(p)
    } else {
      Players.update({ player }, { $set: { y: p.y + p.speed } })
      checkCollision(p)
    }
  },
  'move.left'(player) {
    const p = getPlayer(player)
    if (p.x <= 0) {
      Players.update({ player }, { $set: { x: GAME_WIDTH } })
      checkCollision(p)
    } else {
      Players.update({ player }, { $set: { x: p.x - p.speed } })
      checkCollision(p)
    }
  },
  'move.right'(player) {
    const p = getPlayer(player)
    if (p.x >= GAME_WIDTH - p.size || !p) {
      Players.update({ player }, { $set: { x: 0 } })
      checkCollision(p)
    } else {
      Players.update({ player }, { $set: { x: p.x + p.speed } })
      checkCollision(p)
    }
  }
})
