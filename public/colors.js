import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Layer, Stage, Rect } from "react-konva";
import Player from "../../components/Player";
import { Players } from "../../../api/players";
import { Dimensions } from "../../../api/dimensions";
import Winner from "../Winner";
import "./styles.css";
import Konva from "konva";
import { Meteor } from "meteor/meteor";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GRID,
  BRICK_GAP,
  BRICK_ROWS
} from "../config";

class Game extends Component {
  constructor(props) {
    super(props);

    this.direction = {};
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.stageRef = React.createRef();
  }
  move() {
    if ("ArrowUp" in this.direction) Meteor.call("move.up", Meteor.userId());
    if ("ArrowDown" in this.direction)
      Meteor.call("move.down", Meteor.userId());
    if ("ArrowRight" in this.direction)
      Meteor.call("move.right", Meteor.userId());
    if ("ArrowLeft" in this.direction)
      Meteor.call("move.left", Meteor.userId());
  }
  componentDidMount() {
    Meteor.call("reset.players");

    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.framesPerSecond = 30;
    setInterval(this.updateAll.bind(this), 1000 / this.framesPerSecond);

    this.resetGame();

    window.onkeydown = e => {
      this.direction[e.key] = true;
      console.log(e.key);
      switch (e.key) {
        case "Enter":
          Meteor.call("add.player", "asdwddwfew" + Math.random() * 1000);
          break;
        default:
          break;
      }
    };
    window.onkeyup = e => {
      delete this.direction[e.key];
    };
  }
  resetGame() {
    BRICK_GRID.map((brick, index) => {
      return (BRICK_GRID[index] = "blue");
    });
  }
  updateAll() {
    this.move();
    this.drawAll();
  }
  drawAll() {
    // this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black') //clear screen
    // this.drawGrid() // draw grid
    this.drawPlayers(); // draw players

    // canvas data
  }
  colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }
  colorCircle(centerX, centerY, radius, fillColor) {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
  drawPlayers() {
    if (this.props.players.length > 0) {
      this.props.players.forEach(player => {
        this.colorCircle(player.x, player.y, player.size, player.color);
      });
    } else {
      console.log("no");
    }
  }
  drawGrid = () => {
    for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
        this.colorRect(
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          BRICK_GRID[eachCol]
        );
      }
    }
  };
  // checkifArr(arr) {

  // }

  checkCanvasData() {
    // convert hex to rgb
    function convertColor(color) {
      /* Check for # infront of the value, if it's there, strip it */

      if (color.substring(0, 1) == "#") {
        color = color.substring(1);
      }

      var rgbColor = {};

      /* Grab each pair (channel) of hex values and parse them to ints using hexadecimal decoding */
      rgbColor.r = parseInt(color.substring(0, 2), 16);
      rgbColor.g = parseInt(color.substring(2, 4), 16);
      rgbColor.b = parseInt(color.substring(4), 16);

      return rgbColor;
    }

    // let callbacks = {};

    // function add(_case, fn) {
    //   callbacks[_case] = callbacks[_case] || [];
    //   callbacks[_case].push(fn);
    // }

    // function pseudoSwitch(value) {
    //   if (callbacks[value]) {
    //     callbacks[value].forEach(function(fn) {
    //       fn();
    //     });
    //   }
    // }

    // this.canvasContext = this.canvas.getContext('2d')
    this.canvasData = this.ctx.getImageData(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // console.log(this.canvasData.data.length);
    // console.log(convertColor(this.props.players[0].color))
    const canvasColors = this.canvasData.data;

    const p1 = convertColor(this.props.players[0].color);

    // get hex from each player
    const playerColors = this.props.players.map(player =>
      convertColor(player.color)
    );

    // add each hex to sudoswitch
    // playerColors.map(color =>
    //   add("player color", function() {
    //     color;
    //   })
    // );

    console.log(playerColors);
    // console.log(callbacks);

    for (let i = 0; i < canvasColors.length; i++) {
      if (i % 4 != 3) {
        for (let x = 0; x < playerColors.length; x++) {
          if (
            canvasColors[i] === playerColors[x].r &&
            canvasColors[i + 1] === playerColors[x].g &&
            canvasColors[i + 2] === playerColors[x].b
          ) {
            console.log("player", x, "points");
          }
        }
        // pseudoSwitch(canvasColors[i], canvasColors[i + 1], canvasColors[i + 2]);
      }
    }
  }
  render() {
    const { players } = this.props;
    console.log(players);
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <canvas id="game" width={GAME_WIDTH} height={GAME_HEIGHT} />
        <button onClick={this.checkCanvasData.bind(this)}>
          Check the data!!!!!
        </button>
        <Winner />
      </div>
    );
  }
}

export default withTracker(() => {
  //Meteor.subscribe('players')
  return {
    players: Players.find({}).fetch()
  };
})(Game);
