import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PlayerList from "../../components/PlayerList";
import { Players } from "../../../api/players";
import { GameBoard } from "../../../api/gameboard";
import "./styles.css";
import Timer from "../../components/Timer";
import { Meteor } from "meteor/meteor";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GAP,
  BRICK_ROWS
} from "../config";
import Modal from "../Modal";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startGameTimer: false,
      show: false
    };
    this.direction = {};
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
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.framesPerSecond = 30;
    this.init = false;
    this.canvas.addEventListener(
      "mousemove",
      this.updateMousePosition.bind(this)
    );

    window.onkeydown = e => {
      this.direction[e.key] = true;
      switch (e.key) {
        case "p":
          Meteor.call("add.player", "asdf" + Math.floor(Math.random() * 1000));

          break;
        case "Enter":
          Meteor.call("reset.gameboard");
          this.setState(prevState => ({
            startGameTimer: !prevState.startGameTimer
          }));
          break;
        case "`":
          Meteor.call("reset.players");
          Meteor.call("reset.gameboard");
          break;
        default:
          break;
      }
    };
    window.onkeyup = e => {
      delete this.direction[e.key];
    };
  }
  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const root = document.documentElement;

    this.mouseX = e.clientX - rect.left - root.scrollLeft;
    this.mouseY = e.clientY - rect.top - root.scrollTop;
  }
  updateAll() {
    this.move();
    this.drawAll();
  }
  drawAll() {
    this.colorRect(0, 0, this.canvas.width, this.canvas.height, "#fff"); //clear screen
    this.drawGrid(); // draw grid
    this.drawPlayers(); // draw players

    //USED FOR SEEING BLOCK INDEX LOCATIONS
    // this.colorText(
    //   `${mouseBrickCol},${mouseBrickRow}:${brickIndex}`,
    //   this.mouseX,
    //   this.mouseY,
    //   'yellow'
    // )'
  }
  colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, text) {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }
  colorCircle(centerX, centerY, radius, fillColor) {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#000000";
    this.ctx.stroke();
  }
  colorText(showWords, textX, textY, fillColor) {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillText(showWords, textX, textY);
  }
  drawPlayers() {
    if (this.props.players.length > 0) {
      this.player = this.props.players.find(
        player => player.player === Meteor.userId()
      );
      this.props.players.forEach(player => {
        this.colorCircle(player.x, player.y, player.size, player.color);
      });
    }
  }
  rowColToArrayIndex(col, row) {
    return col + BRICK_COLUMNS * row;
  }
  initGrid = () => {
    const TILES = this.props.bricks;
    if (TILES.length > 0) {
      for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
          const arrayIndex = this.rowColToArrayIndex(eachCol, eachRow);
          let powerup = false;
          if (
            arrayIndex === 200 ||
            arrayIndex === 89 ||
            arrayIndex === 99 ||
            arrayIndex === 109 ||
            arrayIndex === 189 ||
            arrayIndex === 0 ||
            arrayIndex === 320
          )
            powerup = true; // temp powerups
          GameBoard.update(
            { _id: this.props.bricks[arrayIndex]._id },
            { $set: { index: arrayIndex, powerup } },
            { upsert: true }
          );
          this.colorRect(
            BRICK_WIDTH * eachCol,
            BRICK_HEIGHT * eachRow,
            BRICK_WIDTH - BRICK_GAP,
            BRICK_HEIGHT - BRICK_GAP,
            TILES[arrayIndex].color
          );
        }
      }
    }
    Meteor.call("reset.gameboard");
    setInterval(this.updateAll.bind(this), 1000 / this.framesPerSecond);
  };
  drawGrid = () => {
    const TILES = this.props.bricks;
    if (TILES.length > 0) {
      for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
          const arrayIndex = this.rowColToArrayIndex(eachCol, eachRow);

          this.colorRect(
            BRICK_WIDTH * eachCol,
            BRICK_HEIGHT * eachRow,
            BRICK_WIDTH - BRICK_GAP,
            BRICK_HEIGHT - BRICK_GAP,
            TILES[arrayIndex].color
          );
          if (TILES[arrayIndex].powerup) {
            // draws a powerup circle thats green
            this.colorCircle(
              BRICK_WIDTH * eachCol + BRICK_HEIGHT / 2,
              BRICK_HEIGHT * eachRow + BRICK_WIDTH / 2,
              10,
              "green"
            );
          }
        }
      }
    }
  };
  closeModal() {
    this.setState({
      show: false
    });
  }
  getCount = (arr, player) => {
    const count =
      (arr.filter(brick => brick.color === player.color).length / arr.length) *
      100;
    return count.toFixed(1);
  };
  calcWinner = () => {
    let winnerArr = this.props.bricks.map(brick => brick.color);
    function findWinner(arr) {
      return arr
        .sort(
          (a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        )
        .pop();
    }
    console.log(findWinner(winnerArr));
    console.log("player;", this.props.players);
    // alert(findWinner(winnerArr));
    this.setState({ show: true });
    if (findWinner(winnerArr) === "#f4f4f4") {
      console.log("Get rekt by the House");
    } else {
      // let winnerName = this.props.players.filter(
      //   player => player.color === findWinner(winnerArr)
      // );
      console.log("Winner is:", findWinner(winnerArr));
    }
  };
  render() {
    if (!this.init && this.props.bricks.length >= BRICK_COLUMNS * BRICK_ROWS) {
      // ensures the entire gameboard has been loaded in the server before starting
      this.init = true;
      this.initGrid();
    }
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <canvas id="game" width={GAME_WIDTH} height={GAME_HEIGHT} />
        <div style={{ height: "100vh", background: "pink" }}>
          <h1>Paintr</h1>
          <p>Controls</p>
          <p>'Enter' -Start</p>
          <p>' ` ' -Reset</p>
          <Timer
            start={this.state.startGameTimer}
            calcWinner={this.calcWinner}
          />
          <PlayerList
            getCount={(arr, player) => this.getCount(arr, player)}
            players={this.props.players || []}
            bricks={this.props.bricks || []}
          />
        </div>
        <Modal show={this.state.show} close={this.closeModal}>
          <p>WINNNNNNNERRRRRRRRRR</p>
        </Modal>
      </div>
    );
  }
}

export default withTracker(() => {
  //Meteor.subscribe('players')
  return {
    bricks: GameBoard.find({}).fetch(),
    players: Players.find({}).fetch()
  };
})(Game);
