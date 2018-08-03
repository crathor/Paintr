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
import { GAME_WIDTH, GAME_HEIGHT } from '../config'

const grid = 200
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
  updateAll() {
    this.move()
    this.drawAll()
  }
  drawAll() {
    this.buildRect(0, 0, this.canvas.width, this.canvas.height, 'black')
    this.drawPlayers()
  }
  buildRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    this.ctx.fillStyle = fillColor
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
  }
  drawPlayers() {
    if (this.props.players.length > 0) {
      this.props.players.forEach(player => {
        this.ctx.fillStyle = player.color
        this.ctx.beginPath()
        this.ctx.arc(player.x, player.y, 10, 0, Math.PI * 2, true)
        this.ctx.fill()
      })
    } else {
      console.log('no')
    }
  }
  generateGrid = () => {
    const width = window.innerWidth
    const Height = window.innerHeight
    return GameGrid.map((grid, index) => {
      if (index % 100 === 0) {
        y += 20
      }
      if (index % 100 !== 0) {
        x += 20
      }
      return (
        <Rect key={index} width={20} height={20} x={x} y={y} fill={'black'} />
      )
    })
  }
  render() {
    let x = 0
    let y = 0
    const GameGrid = Array(grid).fill('hello')
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
