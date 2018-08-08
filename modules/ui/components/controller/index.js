import React, { Component } from "react";
import Joystick from "./Joystick";

class Controller extends Component {
  state = {
    playerCreated: false,
    name: ""
  };
  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        playerCreated: true,
        name: ""
      },
      () => {
        console.log("a name was sumbmitted", this.state.name);
      }
    );
  };
  render() {
    const { playerCreated } = this.state;
    return (
      <div>
        {playerCreated ? (
          <Joystick />
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
