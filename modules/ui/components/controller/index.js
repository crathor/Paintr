import React, { Component, Fragment } from "react";
import Joystick from "./Joystick";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Players } from "../../../api/players";
import "./styles.css";

class Controller extends Component {
  state = {
    playerCreated: false,
    name: ""
  };
  handleChange = event => {
    if (event.target.value.length > 8) return;
    this.setState({ name: event.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.name === "") return;
    await Meteor.call("add.player", this.state.name, (err, res) => {
      console.log(err);
    });
    this.setState({ playerCreated: true });
  };
  render() {
    const { player } = this.props;
    const { playerCreated } = this.state;
    let styles = {
      width: "100vw",
      height: "100vh",
      backgroundImage: "none",
      background: player[0] ? player[0].color : "white"
    };
    if (player[0]) {
      if (player[0].frozen) {
        styles.backgroundColor = "rgba(30, 144, 255, 0.3)";
      }
    }

    return (
      <div style={styles}>
        {playerCreated ? (
          <Fragment>
            <div className="joystickInfo">
              <h1 className="joystickName">{player[0] && player[0].name}</h1>
              <p
                className={player[0] && player[0].boost ? "joystickBoost" : ""}
              >
                {player[0] && (player[0].boost && "Boost!")}
              </p>
              <p
                className={
                  player[0] && player[0].frozen ? "joystickFrozen" : ""
                }
              >
                {player[0] && (player[0].frozen && "Frozen!")}
              </p>
            </div>

            <Joystick />
          </Fragment>
        ) : (
          <div className="rainbowBackground formBackground">
            <h1 className="mobileTitle">paintr</h1>
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
export default withTracker(() => {
  Meteor.subscribe("player");
  Meteor.subscribe("gameboard");
  return {
    player: Players.find({})
      .fetch()
      .filter(curr => curr.player === Meteor.userId())
  };
})(Controller);