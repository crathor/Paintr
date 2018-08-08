import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import "./styles.css";

class PlayerList extends Component {
  getCountPercentage(count, arrayLength) {
    const percentage = (count * 100) / arrayLength;
    return percentage.toFixed(1);
  }
  render() {
    const { players, bricks } = this.props;
    const brickColors = bricks.map(brick => brick.color);
    const playerList = players
      .map(player => {
        const count = brickColors.filter(color => color === player.color)
          .length;
        return {
          ...player,
          count
        };
      })
      .sort((a, b) => a.count < b.count);
    return (
      <ul className="sideBar">
        {playerList.length === 0 ? (
          <h1 className="noPlayers">No Players</h1>
        ) : (
          playerList
            .map(player => {
              return (
                <li
                  key={player._id}
                  style={{ background: player.color, color: "#fff" }}
                  className="playerCard"
                >
                  <div>
                    <h3 className="playerName">{player.name}</h3>
                    <p className="boost">{player.boost && "BOOST!!"}</p>
                    <p className="frozen">{player.frozen && "FROZEN!"}</p>
                  </div>
                  <div>
                    <p className="playerPercent">
                      {this.getCountPercentage(player.count, bricks.length)}%
                    </p>
                  </div>
                </li>
              );
            })
            .sort((a, b) => a.speed > b.speed)
        )}
      </ul>
    );
  }
}

export default PlayerList;
