import React, { Component } from "react";
import Joystick from "./Joystick";
import { Meteor } from "meteor/meteor";
import "./styles.css";

class Controller extends Component {
  state = {
    playerCreated: false,
    name: "",
    player: {}
  };
  handleChange = event => {
    if (event.target.value.length > 8) return;
    this.setState({ name: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.name === "") return;
    this.setState(
      {
        playerCreated: true
      },
      async () => {
        await Meteor.call("add.player", this.state.name);
        Meteor.call("get.player", Meteor.userId(), (err, res) => {
          this.setState({ player: res });
        });
      }
    );
  };
  render() {
    const { playerCreated, player } = this.state;
    return (
      <div>
        {playerCreated ? (
          <Joystick player={player} />
        ) : (
          <div className="rainbowBackground formBackground">
            <h1 className="gameTitle">paintr</h1>
            <form className="formContainer" onSubmit={this.handleSubmit}>
              <input
                className="nameInput"
                placeholder="Enter Name"
                type="text"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <input className="nameSubmit" type="submit" value="Submit" />
              {/* <button className="nameSubmit" type="submit" value="Submit" /> */}
            </form>
          </div>
        )}
      </div>
    );
  }
}
export default Controller;
