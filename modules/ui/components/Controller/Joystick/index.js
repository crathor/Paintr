import React, { Component } from "react";
import ReactNipple from "react-nipple";
import DebugView from "react-nipple/lib/DebugView";
import "react-nipple/lib/styles.css";
class Joystick extends Component {
  state = { data: {} };
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
  handleEvent = (evt, data) => {
    console.log(evt);
    this.setState({ data });
  };
}

export default Joystick;
