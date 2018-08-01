import React, { Component } from "react";
import nipplejs from "nipplejs";
import { Meteor } from "meteor/meteor";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.joystickZone = React.createRef();
    this.manager = nipplejs.create();
    this.manager.options = {
      zone: this.joystickZone
    };
    this.direction = {};
  }
  move() {
    // console.log(this.direction)
    if ("dir:up" in this.direction) Meteor.call("move.up", Meteor.userId());
    if ("dir:down" in this.direction) Meteor.call("move.down", Meteor.userId());
    if ("dir:right" in this.direction)
      Meteor.call("move.right", Meteor.userId());
    if ("dir:left" in this.direction) Meteor.call("move.left", Meteor.userId());
  }
  componentDidMount() {
    this.manager
      .on("added", (evt, nipple) => {
        nipple.on("dir:up", evt => {
          this.direction["dir:up"] = true;
        });
        nipple.on("dir:down", evt => {
          this.direction["dir:down"] = true;
        });
        nipple.on("dir:left", evt => {
          this.direction["dir:left"] = true;
        });
        nipple.on("dir:right", evt => {
          this.direction["dir:right"] = true;
        });
      })
      .on("removed", (evt, nipple) => {
        nipple.off("start move end dir plain");
        this.direction = {};
      });

    setInterval(() => {
      window.requestAnimationFrame(this.move.bind(this));
    }, 30);
  }
  render() {
    return (
      <div ref={this.joystickZone}>
        <div id="joystick-zone" />
      </div>
    );
  }
}

export default Controller;
