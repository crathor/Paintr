import React, { Component } from "react";
import ReactNipple from "react-nipple";
import "react-nipple/lib/styles.css";
import { Meteor } from "meteor/meteor";
class Joystick extends Component {
  handleEvent = (evt, data) => {
    console.log(evt.type, data.angle);
    const { degree } = data.angle;
    switch (evt.type) {
      case "move":
        if (degree > 337.5 || degree < 22.5)
          Meteor.call("move.right", Meteor.userId());
        else if (degree > 22.5 && degree < 67.5) {
          Meteor.call("move.right", Meteor.userId());
          Meteor.call("move.up", Meteor.userId());
        } else if (degree > 67.5 && degree < 112.5) {
          Meteor.call("move.up", Meteor.userId());
        } else if (degree > 112.5 && degree < 157.5) {
          Meteor.call("move.left", Meteor.userId());
          Meteor.call("move.up", Meteor.userId());
        } else if (degree > 157.5 && degree < 202.5) {
          Meteor.call("move.left", Meteor.userId());
        } else if (degree > 202.5 && degree < 247.5) {
          Meteor.call("move.left", Meteor.userId());
          Meteor.call("move.down", Meteor.userId());
        } else if (degree > 247.5 && degree < 292.5) {
          Meteor.call("move.down", Meteor.userId());
        } else if (degree > 292.5 && degree < 337.5) {
          Meteor.call("move.right", Meteor.userId());
          Meteor.call("move.down", Meteor.userId());
        }
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <ReactNipple
          options={{
            mode: "static",
            position: { top: "50%", left: "50%" },
            color: "black"
          }}
          style={{
            outline: "1px dashed red",
            width: "100vw",
            height: "100vh",
            position: "relative"
          }}
          onMove={this.handleEvent}
        />
      </div>
    );
  }
}

export default Joystick;
