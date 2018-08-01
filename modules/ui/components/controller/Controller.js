import React, { Component } from "react";
import nipplejs from "nipplejs";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.joystickZone = React.createRef();
    this.manager = nipplejs.create();
    this.manager.options = {
      zone: this.joystickZone
    };
  }
  componentDidMount() {}
  render() {
    this.manager
      .on("added", function(evt, nipple) {
        nipple.on("dir:up", function(evt) {
          console.log("dir UP", evt);
        });
        nipple.on("dir:down", function(evt) {
          console.log("dir DOWN", evt);
        });
        nipple.on("dir:left", function(evt) {
          console.log("dir LEFT", evt);
        });
        nipple.on("dir:right", function(evt) {
          console.log("dir RIGHT", evt);
        });
        // nipple.on("plain:left", function(evt) {
        //   console.log("plain LEFT", evt);
        // });
        // nipple.on("plain:right", function(evt) {
        //   console.log("plain RIGHT", evt);
        // });
        // nipple.on("plain:up", function(evt) {
        //   console.log("plain UP", evt);
        // });
        // nipple.on("plain:down", function(evt) {
        //   console.log("plain DOWN", evt);
        // });
      })
      .on("removed", function(evt, nipple) {
        nipple.off("start move end dir plain");
      });

    return (
      <div ref={this.joystickZone}>
        <div id="joystick-zone" />
      </div>
    );
  }
}

export default Controller;
