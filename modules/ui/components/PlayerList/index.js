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
        const count =
          brickColors.filter(color => color === player.color).length || 0;
        return {
          ...player,
          count
        };
      })
      .sort((a, b) => a.count < b.count);
    return (
      <div className="players-container">
        <ul>
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
<<<<<<< HEAD
                      <p className={player.frozen ? 'frozen' : 'boost'}>
                        {player.frozen ? 'FROZEN' : player.boost && 'BOOST!!'}
                      </p>
=======
                    </div>
                    <div>
                      {player.frozen ? (
                        <p className="frozen">FROZEN!</p>
                      ) : (
                        player.boost && <p className="boost">BOOST!</p>
                      )}
>>>>>>> bfc2f405ea6283629b71659ebd201be72b9f0d13
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
      </div>
    );
  }
}

export default PlayerList;
