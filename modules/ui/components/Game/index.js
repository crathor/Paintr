import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import { GameBoard } from '../../../api/gameboard'
import Winner from '../Winner'
import './styles.css'
import { Meteor } from 'meteor/meteor'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GRID,
  BRICK_GAP,
  BRICK_ROWS
} from '../config'

class Game extends Component {
  constructor(props) {
    super(props)

    this.direction = {}
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.stageRef = React.createRef()
  }
  move() {
    if ('ArrowUp' in this.direction) Meteor.call('move.up', Meteor.userId())
    if ('ArrowDown' in this.direction) Meteor.call('move.down', Meteor.userId())
    if ('ArrowRight' in this.direction)
      Meteor.call('move.right', Meteor.userId())
    if ('ArrowLeft' in this.direction) Meteor.call('move.left', Meteor.userId())
  }
  componentDidMount() {
    Meteor.call('reset.players')
    this.mouseX = 0
    this.mouseY = 0
    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')
    this.framesPerSecond = 30
    this.init = false

    this.canvas.addEventListener(
      'mousemove',
      this.updateMousePosition.bind(this)
    )

    window.onkeydown = e => {
      this.direction[e.key] = true
      switch (e.key) {
        case 'Enter':
          Meteor.call('add.player', 'asdwddwfew' + Math.random() * 1000)
          break
        case '`':
          Meteor.call('reset.gameboard')
          break
        default:
          break
      }
    }
    window.onkeyup = e => {
      delete this.direction[e.key]
    }
  }
  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect()
    const root = document.documentElement

    this.mouseX = e.clientX - rect.left - root.scrollLeft
    this.mouseY = e.clientY - rect.top - root.scrollTop
  }
  updateAll() {
    this.move()
    this.drawAll()
  }
  drawAll() {
    this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black') //clear screen
    this.drawGrid() // draw grid
    this.drawPlayers() // draw players
    // this.colorText(
    //   `${mouseBrickCol},${mouseBrickRow}:${brickIndex}`,
    //   this.mouseX,
    //   this.mouseY,
    //   'yellow'
    // )
  }
  colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, text) {
    this.ctx.fillStyle = fillColor
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
  }
  colorCircle(centerX, centerY, radius, fillColor) {
    this.ctx.fillStyle = fillColor
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
    this.ctx.fill()
  }
  colorText(showWords, textX, textY, fillColor) {
    this.ctx.fillStyle = fillColor
    this.ctx.fillText(showWords, textX, textY)
  }
  drawPlayers() {
    if (this.props.players.length > 0) {
      this.player = this.props.players.find(
        player => player.player === Meteor.userId()
      )
      this.props.players.forEach(player => {
        this.colorCircle(player.x, player.y, player.size, player.color)
      })
    }
  }
  rowColToArrayIndex(col, row) {
    return col + BRICK_COLUMNS * row
  }
  initGrid = () => {
    const TILES = this.props.bricks
    if (TILES.length > 0) {
      for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
          const arrayIndex = this.rowColToArrayIndex(eachCol, eachRow)
          let powerup = false
          if (arrayIndex === 200 || arrayIndex === 89) powerup = true
          GameBoard.update(
            { _id: this.props.bricks[arrayIndex]._id },
            { $set: { index: arrayIndex, powerup } },
            { upsert: true }
          )
          this.colorRect(
            BRICK_WIDTH * eachCol,
            BRICK_HEIGHT * eachRow,
            BRICK_WIDTH - BRICK_GAP,
            BRICK_HEIGHT - BRICK_GAP,
            TILES[arrayIndex].color
          )
        }
      }
    }
    setInterval(this.updateAll.bind(this), 1000 / this.framesPerSecond)
  }
  drawGrid = () => {
    const TILES = this.props.bricks
    if (TILES.length > 0) {
      for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
          const arrayIndex = this.rowColToArrayIndex(eachCol, eachRow)

          this.colorRect(
            BRICK_WIDTH * eachCol,
            BRICK_HEIGHT * eachRow,
            BRICK_WIDTH - BRICK_GAP,
            BRICK_HEIGHT - BRICK_GAP,
            TILES[arrayIndex].color
          )
          if (TILES[arrayIndex].powerup) {
            this.colorCircle(
              BRICK_WIDTH * eachCol + 25,
              BRICK_HEIGHT * eachRow + 25,
              20,
              'green'
            )
          }
        }
      }
    }
  }
  render() {
    if (!this.init && this.props.bricks.length >= BRICK_COLUMNS * BRICK_ROWS) {
      this.init = true
      this.initGrid()
    }
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <canvas id="game" width={GAME_WIDTH} height={GAME_HEIGHT} />
        <div style={{ height: '100vh', background: 'pink' }}>
          <h1>Paintr</h1>
          <ul>
            {this.props.players.map(player => {
              return (
                <li key={player._id}>
                  <h3>{player.name}</h3>
                  <p>{player.speed}</p>
                  <p>{player.size}</p>
                  <p>{player.color.toString()}</p>
                </li>
              )
            })}
          </ul>
        </div>
        <Winner />
      </div>
    )
  }
}

export default withTracker(() => {
  //Meteor.subscribe('players')
  return {
    bricks: GameBoard.find({}).fetch(),
    players: Players.find({}).fetch()
  }
})(Game)
