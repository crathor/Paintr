import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Layer, Stage } from 'react-konva'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import Controller from '../../components/Controller'
import './styles.css'

class Game extends Component {
  constructor(props) {
    super(props)

    this.direction = {}
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
  }
  move() {
    if ('ArrowUp' in this.direction) Meteor.call('move.up', Meteor.userId())
    if ('ArrowDown' in this.direction)
      Meteor.call('move.down', Meteor.userId(), this.windowHeight)
    if ('ArrowRight' in this.direction)
      Meteor.call('move.right', Meteor.userId(), this.windowWidth)
    if ('ArrowLeft' in this.direction) Meteor.call('move.left', Meteor.userId())
  }

  componentDidMount() {
    window.onkeydown = e => {
      this.direction[e.key] = true
      switch (e.key) {
        case 'Enter':
          Meteor.call('add.player', 'Cody' + Math.random() * 1000)
          break
        case '-':
          Meteor.call('remove.player', Meteor.userId())
          break

        default:
          break
      }
    }
    window.onkeyup = e => {
      delete this.direction[e.key]
    }
    setInterval(() => {
      window.requestAnimationFrame(this.move.bind(this))
    }, 30)
  }
  render() {
    const { players } = this.props
    return (
      <div style={{ display: 'flex' }}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ background: '#ccc' }}
        >
          <Layer clearBeforeDraw={false}>
            {players.length
              ? players.map(player => (
                  <Player key={player._id} player={player} />
                ))
              : null}
          </Layer>
        </Stage>
        <Controller />
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
