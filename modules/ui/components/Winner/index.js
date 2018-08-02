import React, { Component } from "react";
import * as Vibrant from "node-vibrant";

componentDidMount = () => {
  console.log("did run");

  Vibrant.from("./img/Screen Shot 2018-08-02 at 9.19.35 AM.png").getPalette(
    (err, palette) => console.log(palette)
  );
};

class Winner extends Component {
  render() {
    return <div />;
  }
}

export default Winner;
