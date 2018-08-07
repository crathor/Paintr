import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

class PlayerList extends Component {
  getCount(arr, player) {
    const count =
      (arr.filter(brick => brick.color === player.color).length / arr.length) *
      100;
    return count.toFixed(1);
  }
  render() {
    const { players, bricks } = this.props;
    return (
      <ul>
        {players
          .map(player => {
            const count = this.getCount(bricks, player);
            return (
              <li
                key={player._id}
                style={{
                  background: player.color,
                  color: "#fff"
                }}
              >
                <h3>name: {player.name}</h3>
                <p>speed: {player.speed}</p>
                <p>size: {player.size}</p>
                <p>Count: {count}%</p>
                <button onClick={() => Meteor.call("boost.player", player)}>
                  speed
                </button>
              </li>
            );
          })
          .sort((a, b) => a.speed > b.speed)}
      </ul>
    );
  }
}

export default PlayerList;
