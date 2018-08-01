import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Layer, Rect, Stage, Group, Circle } from 'react-konva'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import Controller from '../../components/controller'
import './styles.css'
class App extends Component {
  constructor(props) {
    super(props)

    this.direction = {}
  }
  move() {
    if ('ArrowUp' in this.direction) Meteor.call('move.up', Meteor.userId())
    if ('ArrowDown' in this.direction) Meteor.call('move.down', Meteor.userId())
    if ('ArrowRight' in this.direction)
      Meteor.call('move.right', Meteor.userId())
    if ('ArrowLeft' in this.direction) Meteor.call('move.left', Meteor.userId())
  }

  componentDidMount() {
    window.onkeydown = e => {
      this.direction[e.key] = true
      switch (e.key) {
        case '`':
          Meteor.call('show.message', {
            player: Meteor.userId(),
            showMessage: !Avengers.findOne({ direction: Meteor.userId() })
              .showMessage
          })
          break
        case '-':
          Meteor.call('remove.avenger', Meteor.userId())
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
    console.log(this.props.players)
    return (
      <div style={{ display: 'flex' }}>
        <Stage
          width={window.innerWidth / 2}
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
        <div className="controllerZone">
          <Controller />
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    players: Players.find({}).fetch()
  }
})(App)
