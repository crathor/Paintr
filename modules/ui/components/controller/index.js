import React, { Component } from "react";
import nipplejs from "nipplejs";
import { Meteor } from "meteor/meteor";
import "./styles.css";
import {
  BRICK_COLUMNS,
  BRICK_GRID,
  BRICK_ROWS,
  BRICK_HEIGHT,
  BRICK_WIDTH
} from "../config";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.joystickZone = React.createRef();
    this.options = {
      zone: this.joystickZone,
      color: "#000"
    };
    this.manager = nipplejs.create();
    this.direction = {};
    this.state = {
      name: "",
      hasName: false,
      player: {
        color: "orange"
      }
    };
  }
  move() {
    if ("dir:up" in this.direction) Meteor.call("move.up", Meteor.userId());
    if ("dir:down" in this.direction) Meteor.call("move.down", Meteor.userId());
    if ("dir:right" in this.direction)
      Meteor.call("move.right", Meteor.userId());
    if ("dir:left" in this.direction) Meteor.call("move.left", Meteor.userId());
  }
  componentDidMount() {
    Meteor.call("add.player", "asdf" + Math.floor(Math.random() * 1000));
    Meteor.call("get.player", Meteor.userId(), (err, res) => {
      this.setState({ player: res });
    });
    this.manager
      .on("added", (evt, nipple) => {
        nipple.on("dir:up", evt => {
          this.direction = {};
          this.direction["dir:up"] = true;
        });
        nipple.on("dir:down", evt => {
          this.direction = {};
          this.direction["dir:down"] = true;
        });
        nipple.on("dir:left", evt => {
          this.direction = {};
          this.direction["dir:left"] = true;
        });
        nipple.on("dir:right", evt => {
          this.direction = {};
          this.direction["dir:right"] = true;
        });
      })
      .on("removed", (evt, nipple) => {
        nipple.off("start move end dir plain");
        this.direction = {};
      });

    this.framesPerSecond = 30;
    setInterval(this.updatePlayer.bind(this), 1000 / this.framesPerSecond);
  }
  updatePlayer() {
    this.move();
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("a name was sumbmitted", this.state.name);
    this.setState({
      hasName: true
    });
  }
  render() {
    const hasName = this.state.hasName;
    // const name = this.state.name;
    return (
      <div>
        {hasName ? (
          <div
            style={{
              background: this.state.player.color || "purple",
              width: "100vw",
              height: "100vh"
            }}
          >
            <div id="joystick-zone" ref={this.joystickZone} />
          </div>
        ) : (
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Controller;
