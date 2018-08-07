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
            if (player.powerup.reverse) {
              setTimeout(() => {
                Meteor.call("reset.player.reverse", player);
              }, 5000);
            }
            const count = this.getCount(bricks, player);
            if (player.powerup.speed) {
              setTimeout(() => {
                Meteor.call("reset.player.speed", player);
              }, 5000);
            }
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
                <p>{player.powers.join(",")}</p>
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
