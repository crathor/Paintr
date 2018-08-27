import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PlayerList from '../PlayerList'
import { Players } from '../../../api/players'
import { GameBoard } from '../../../api/gameboard'
import Timer from '../Timer'
import { Meteor } from 'meteor/meteor'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_ROWS,
  FRAMES_PER_SECOND
} from '../config'
import { refreshCanvas } from './helpers/refreshCanvas'
import { drawGameboard, initGameboard } from './helpers/drawGameboard'
import { drawPlayers } from './helpers/drawPlayers'
import { getWinner } from './helpers/getWinner'
import './styles.css'

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
  }
  componentDidMount() {
    Meteor.call('reset.players')
    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')
    this.framesPerSecond = FRAMES_PER_SECOND
    this.init = false
  }
  drawGame = () => {
    refreshCanvas(this.ctx, 0, 0, this.canvas.width, this.canvas.height, '#000') //clear screen
    drawGameboard(this.ctx, this.props.bricks) // draw grid
    drawPlayers(this.props.players, this.ctx) // draw players
  }

  calcWinner = async () => {
    const { bricks, players } = this.props
    const winner = await getWinner(bricks, players)
    this.setState({ winner, show: true })
  }

  render() {
    const { winner, show } = this.state
    if (!this.init && this.props.bricks.length >= BRICK_COLUMNS * BRICK_ROWS) {
      // ensures the entire gameboard has been loaded in the server before starting
      this.init = true
      initGameboard(
        this.ctx,
        this.props.bricks,
        this.drawGame,
        this.framesPerSecond
      )
    }
    return (
      <div className="rainbowBackground">
        <div className="Paintr">
          <header className="headerContainer">
            <div className="header">
              <div className="titleLogo">
                <h1 className="gameTitle">Paintr</h1>
                <img
                  className="logo"
                  src="/PAINTR.svg"
                  alt="post Travel image"
                  height="58"
                  width="58"
                />
              </div>
              <Timer calcWinner={this.calcWinner} winner={winner} show={show} />
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
