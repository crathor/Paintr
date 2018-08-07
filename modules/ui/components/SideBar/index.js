import React, { Component } from "react";

// sidebar needs to display logo, timer, top user positions from biggest to smaallerst

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  getInfo() {
    console.log(this.props);
    let players = {};
    let bricks = this.props.props.bricks;
    players = this.props.props.players;
    console.log("players", players);
    for (let i = 0; i < bricks.length; i++) {
      for (let x = 0; x < players.length; x++) {
        if (bricks[i].color === players[x].color) {
          players[x].count++;
        }
      }
    }
  }

  render() {
    return (
      <div style={{ height: "100vh", background: "pink" }}>
        <h1>Paintr</h1>
        <button onClick={this.getInfo.bind(this)}>Get Info</button>
      </div>
    );
  }
}

export default SideBar;
