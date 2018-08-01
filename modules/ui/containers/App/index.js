import React, { Component } from "react";
import { Layer, Rect, Stage, Group, Circle } from "react-konva";
import Controller from "../../components/controller";
import "./styles.css";

class Player extends Component {
  state = {
    x: 100,
    y: 100
  };

  componentDidMount() {
    window.addEventListener("keydown", event => {
      if (event.keyCode) {
        console.log(event.keyCode);
        switch (event.keyCode) {
          case 37:
            this.setState(prevState => ({ x: prevState.x - 10 }));
            break;
          case 38:
            this.setState(prevState => ({ y: prevState.y - 10 }));
            break;
          case 39:
            this.setState(prevState => ({ x: prevState.x + 10 }));
            break;
          case 40:
            this.setState(prevState => ({ y: prevState.y + 10 }));
            break;

          default:
            break;
        }
      }
    });
  }
  render() {
    return (
      <Circle
        x={this.state.x}
        y={this.state.y}
        radius={window.innerHeight * 0.01}
        fill="red"
        stroke="black"
      />
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="controllerZone">
        <Controller />
      </div>
    );
  }
}

export default App;

{
  /* <Stage
  width={window.innerWidth}
  height={window.innerHeight}
  style={{ background: '#ccc' }}
>
  <Layer>
    <Player />
  </Layer>
</Stage> */
}
