import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Layer, Stage } from 'react-konva'
import Player from '../../components/Player'
import { Players } from '../../../api/players'
import './styles.css'

class Game extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Meteor.call('reset.players')
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
