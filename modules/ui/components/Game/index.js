import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Layer, Stage, Rect } from 'react-konva'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import { Dimensions } from '../../../api/dimensions'
import Winner from '../Winner'
import './styles.css'
import Konva from 'konva'
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

    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')

    this.framesPerSecond = 30
    setInterval(this.updateAll.bind(this), 1000 / this.framesPerSecond)

    this.resetGame()

    window.onkeydown = e => {
      this.direction[e.key] = true
      console.log(e.key)
      switch (e.key) {
        case 'Enter':
          Meteor.call('add.player', 'asdwddwfew' + Math.random() * 1000)
          break
        default:
          break
      }
    }
    window.onkeyup = e => {
      delete this.direction[e.key]
    }
  }
  resetGame() {
    BRICK_GRID.map((brick, index) => {
      return (BRICK_GRID[index] = 'blue')
    })
  }
  updateAll() {
    this.move()
    this.drawAll()
  }
  drawAll() {
    this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black') //clear screen
    this.drawGrid() // draw grid
    this.drawPlayers() // draw players
  }
  colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    this.ctx.fillStyle = fillColor
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
  }
  colorCircle(centerX, centerY, radius, fillColor) {
    this.ctx.fillStyle = fillColor
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
    this.ctx.fill()
  }
  drawPlayers() {
    if (this.props.players.length > 0) {
      this.props.players.forEach(player => {
        this.colorCircle(player.x, player.y, player.size, player.color)
      })
    } else {
      console.log('no')
    }
  }
  drawGrid = () => {
    for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
        this.colorRect(
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          BRICK_GRID[eachCol]
        )
      }
    }
  }
  render() {
    const { players } = this.props
    console.log(players)
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <canvas id="game" width={GAME_WIDTH} height={GAME_HEIGHT} />
        <Winner />
      </div>
    )
  }
}

export default withTracker(() => {
  //Meteor.subscribe('players')
  return {
    players: Players.find({}).fetch()
  }
})(Game)
