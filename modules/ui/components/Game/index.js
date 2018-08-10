import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PlayerList from '../../components/PlayerList'
import { Players } from '../../../api/players'
import { GameBoard } from '../../../api/gameboard'
import './styles/styles.css'
import Timer from '../../components/Timer'
import { Meteor } from 'meteor/meteor'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GAP,
  BRICK_ROWS,
  RESET_KEY,
  ADD_PLAYER_KEY
} from '../config'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      winner: {
        name: '',
        color: ''
      }
    }
    //this.direction = {}
  }
  componentDidMount() {
    Meteor.call('reset.players')
    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')
    this.framesPerSecond = 30
    this.init = false
  }
  updateAll = () => {
    // this.move()
    this.drawAll()
  }
  drawAll() {
    this.colorRect(0, 0, this.canvas.width, this.canvas.height, '#000') //clear screen
    this.drawGrid() // draw grid
    this.drawPlayers() // draw players
  }
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = (Math.PI / 2) * 3
    var x = cx
    var y = cy
    var step = Math.PI / spikes

    this.ctx.beginPath()
    this.ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      this.ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      this.ctx.lineTo(x, y)
      rot += step
    }
    this.ctx.lineTo(cx, cy - outerRadius)
    this.ctx.closePath()
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = 'black'
    this.ctx.stroke()
    this.ctx.fillStyle = '#d8c308'
    this.ctx.fill()
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
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = '#000000'
    this.ctx.stroke()
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
  initGrid = async () => {
    const TILES = this.props.bricks
    if (TILES.length > 0) {
      for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
          const arrayIndex = this.rowColToArrayIndex(eachCol, eachRow)
          await Meteor.call(
            'init.gameboard',
            this.props.bricks[arrayIndex]._id,
            arrayIndex
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
    Meteor.call('reset.gameboard')
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
            this.drawStar(
              BRICK_WIDTH * eachCol + BRICK_HEIGHT / 2,
              BRICK_HEIGHT * eachRow + BRICK_WIDTH / 2,
              5,
              15,
              10
            )
          }
        }
      }
    }
  }
  calcWinner = () => {
    const { bricks, players } = this.props
    const brickColors = bricks.map(brick => brick.color)
    const playerScores = players
      .map(player => {
        const count = brickColors.filter(color => color === player.color).length
        return {
          ...player,
          count
        }
      })
      .sort((a, b) => a.count < b.count)
    this.setState({ winner: playerScores[0], show: true })
  }
  render() {
    const { winner, show } = this.state
    if (!this.init && this.props.bricks.length >= BRICK_COLUMNS * BRICK_ROWS) {
      // ensures the entire gameboard has been loaded in the server before starting
      this.init = true
      this.initGrid()
    }
    return (
      <div className="rainbowBackground">
        <div className="Paintr">
          <header className="headerContainer">
            <div className="header">
              <h1 className="gameTitle">Paintr</h1>
              <Timer
                calcWinner={this.calcWinner}
                winner={this.state.winner}
                show={this.state.show}
              />
            </div>
          </header>
          <div className="gameSection">
            <PlayerList
              players={this.props.players || []}
              bricks={this.props.bricks || []}
            />
            <canvas
              className="canvas"
              id="game"
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('players')
  Meteor.subscribe('gameboard')
  return {
    bricks: GameBoard.find({}).fetch(),
    players: Players.find({}).fetch()
  }
})(Game)
