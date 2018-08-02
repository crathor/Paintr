import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Layer, Stage } from "react-konva";
import Player from "../../components/Player";
import { Players } from "../../../api/players";
import Controller from "../../components/Controller";
import Winner from "../Winner";
import "./styles.css";
import Konva from "konva";

class Game extends Component {
  constructor(props) {
    super(props);

    this.direction = {};
    this.stageRef = React.createRef();
  }

  componentDidMount() {
    console.log(Konva.Node);
    console.log(this.stageRef.current);
  }
  render() {
    const { players } = this.props;
    return (
      <div style={{ display: "flex" }}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ background: "#ccc" }}
          ref={this.stageRef}
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
        <Winner />
      </div>
    );
  }
}

export default withTracker(() => {
  //Meteor.subscribe('players')
  return {
    players: Players.find({}).fetch()
  };
})(Game);
