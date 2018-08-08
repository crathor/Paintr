import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PlayerList from "../../components/PlayerList";
import { Players } from "../../../api/players";
import { GameBoard } from "../../../api/gameboard";
import "./styles/styles.css";
import Timer from "../../components/Timer";
import { Meteor } from "meteor/meteor";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GAP,
  BRICK_ROWS,
  RESET_KEY,
  START_KEY,
  ADD_PLAYER_KEY
} from "../config";
import Modal from "../Modal";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startGameTimer: false,
      show: false,
      winner: {
        name: "",
        color: ""
      }
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
        case ADD_PLAYER_KEY:
          Meteor.call("add.player", "asdf" + Math.floor(Math.random() * 1000));
          break;
        case RESET_KEY:
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
    this.colorRect(0, 0, this.canvas.width, this.canvas.height, "#000"); //clear screen
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
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.fillStyle = "#d8c308";
    this.ctx.fill();
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
          GameBoard.update(
            { _id: this.props.bricks[arrayIndex]._id },
            { $set: { index: arrayIndex, powerup: false } },
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
            // this.colorCircle(
            //   BRICK_WIDTH * eachCol + BRICK_HEIGHT / 2,
            //   BRICK_HEIGHT * eachRow + BRICK_WIDTH / 2,
            //   10,
            //   '#ff00d0'
            // )
            this.drawStar(
              BRICK_WIDTH * eachCol + BRICK_HEIGHT / 2,
              BRICK_HEIGHT * eachRow + BRICK_WIDTH / 2,
              5,
              10,
              5
            );
          }
        }
      }
    }
  };
  calcWinner = () => {
    const { bricks, players } = this.props;
    const brickColors = bricks.map(brick => brick.color);
    const playerScores = players
      .map(player => {
        const count = brickColors.filter(color => color === player.color)
          .length;
        return {
          ...player,
          count
        };
      })
      .sort((a, b) => a.count < b.count);
    this.setState({ winner: playerScores[0], show: true });
  };
  render() {
    const { winner, show } = this.state;
    if (!this.init && this.props.bricks.length >= BRICK_COLUMNS * BRICK_ROWS) {
      // ensures the entire gameboard has been loaded in the server before starting
      this.init = true;
      this.initGrid();
    }
    return (
      <div className="Paintr">
        <header className="headerContainer">
          <div className="header">
            <h1 className="gameTitle">Paintr</h1>
            <Timer
              start={this.state.startGameTimer}
              calcWinner={this.calcWinner}
              winner={this.state.winner}
              show={this.state.show}
            />
          </div>
        </header>
        <div className="gameSection">
          <PlayerList
            players={this.props.players || []}
            bricks={this.props.bricks || []}
          />
          <canvas
            className="canvas"
            id="game"
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
          />
        </div>
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
