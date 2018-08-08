import React, { Component } from "react";
import ReactNipple from "react-nipple";
import DebugView from "react-nipple/lib/DebugView";
import "react-nipple/lib/styles.css";
class Joystick extends Component {
  state = { data: {} };
  componentDidMount() {}
  handleEvent = (evt, data) => {
    this.setState({ data });
    // console.log(data.direction.x == "left");
    // switch (data.direction) {
    //   case data.direction.x == "left":
    //     console.log("move left");
    //     break;
    // }
    if (data.direction.x === "left") {
      console.log("move left");
    } else if (data.direction.x === "right") {
      console.log("move right");
    }

    if (data.direction.y === "up") {
      console.log("move up");
    } else if (data.direction.y === "down") {
      console.log("move down");
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
            width: 300,
            height: 300,
            position: "relative"
          }}
          onStart={this.handleEvent}
          onEnd={this.handleEvent}
          onMove={this.handleEvent}
          onDir={this.handleEvent}
          onPlain={this.handleEvent}
          onShown={this.handleEvent}
          onHidden={this.handleEvent}
          onPressure={this.handleEvent}
        />
        <DebugView data={this.state.data} />
      </div>
    );
  }
}

export default Joystick;
