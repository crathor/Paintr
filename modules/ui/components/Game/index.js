import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Layer, Stage } from 'react-konva'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import { Dimensions } from '../../../api/dimensions'
import Winner from '../Winner'
import './styles.css'
import Konva from 'konva'
import { Meteor } from 'meteor/meteor'

class Game extends Component {
  constructor(props) {
    super(props)

    this.direction = {}
    this.stageRef = React.createRef()
  }

  componentDidMount() {
    Meteor.call('add.dimensions', window.innerHeight, window.innerWidth)
  }
  render() {
    const { players } = this.props
    return (
      <div style={{ display: 'flex' }}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ background: '#fff' }}
        >
          <Layer clearBeforeDraw={false}>
            {players.length
              ? players.map(player => (
                  <Player key={player._id} player={player} />
                ))
              : null}
          </Layer>
        </Stage>
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
