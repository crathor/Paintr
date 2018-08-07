import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { GameBoard } from "./gameboard";
import Konva from "konva";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_ROWS,
  rowColToArrayIndex
} from "../ui/components/config";

export const Players = new Mongo.Collection("players");

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;
}

const getPlayer = player => {
  return Players.findOne({ player });
};

const checkCollision = player => {
  if (player) {
    const playerBrickCol = Math.floor(player.x / BRICK_WIDTH);
    const playerBrickRow = Math.floor(player.y / BRICK_HEIGHT);
    const brickIndex = rowColToArrayIndex(playerBrickCol, playerBrickRow);

    const brick = GameBoard.find({ index: brickIndex }).fetch();
    if (brick[0].powerup && !player.powerup.speed) {
      const powerChoice = Math.floor(Math.random() * 5);
      let power;
      switch (powerChoice) {
        case 0:
          power = "speed"; // adds player speed
          break;
        case 1:
          power = "bomb"; // reset the whole board
          break;
        case 2:
          power = "steal"; // player claims whole board
          break;

        default:
          power = "speed"; // adds player speed
          break;
      }
      if (player.powers.length < 3) {
        Players.update(
          player._id,
          { $set: { powers: [...player.powers, power] } },
          { upsert: true }
        );
        GameBoard.update(
          { index: brickIndex },
          { $set: { powerup: false } },
          { upsert: true }
        );
      }
    }
    if (brickIndex >= 0 && brickIndex < BRICK_COLUMNS * BRICK_ROWS) {
      GameBoard.update(
        { index: brickIndex },
        { $set: { color: player.color } },
        { upsert: true }
      );
    }
  }
};
Meteor.methods({
  "reset.player.speed"(player) {
    Players.update(
      player._id,
      { $set: { speed: 10, "powerup.speed": false } },
      { upsert: true }
    );
  },
  "reset.players"() {
    Players.remove({});
  },
  "get.player"(id) {
    return getPlayer(id);
  },
  "remove.player"(player) {
    Players.remove({ player });
  },
  "add.player"(name) {
    Players.insert({
      name,
      color: Konva.Util.getRandomColor(),
      count: 0,
      size: 10,
      speed: 10,
      y: Math.floor(1 + Math.random() * GAME_HEIGHT),
      x: Math.floor(1 + Math.random() * GAME_WIDTH),
      powerup: {
        speed: false,
        bomb: false,
        steal: false
      },
      powers: [],
      reverse: false,
      player: Meteor.userId()
    });
  },
  "boost.player"(player) {
    Players.update(
      player._id,
      { $set: { speed: 20, "powerup.speed": true } },
      { upsert: true }
    );
  },
  "reverse.player.direction"(player) {
    if (player.powerup.reverse) return;
    Players.update(
      player._id,
      { $set: { "powerup.reverse": true, speed: (player.speed *= -1) } },
      { upsert: true }
    );
  },
  "reset.player.reverse"(player) {
    if (!player.powerup.reverse) return;
    Players.update(
      player._id,
      { $set: { "powerup.reverse": false, speed: (player.speed *= -1) } },
      { upsert: true }
    );
  },
  "move.up"(player) {
    const p = getPlayer(player);
    if (
      p.powerup.reverse
        ? p.y >= GAME_HEIGHT - BRICK_HEIGHT / 2
        : p.y <= 0 + BRICK_HEIGHT / 2
    )
      return;
    else {
      Players.update({ player }, { $set: { y: p.y - p.speed } });
      checkCollision(p);
    }
  },
  "move.down"(player) {
    const p = getPlayer(player);
    if (
      p.powerup.reverse
        ? p.y <= 0 + BRICK_HEIGHT / 2
        : p.y >= GAME_HEIGHT - BRICK_HEIGHT / 2
    )
      return;
    else {
      Players.update({ player }, { $set: { y: p.y + p.speed } });
      checkCollision(p);
    }
  },
  "move.left"(player) {
    const p = getPlayer(player);
    if (
      p.powerup.reverse
        ? p.x >= GAME_WIDTH - BRICK_WIDTH / 2
        : p.x <= 0 + BRICK_WIDTH / 2
    )
      return;
    else {
      Players.update({ player }, { $set: { x: p.x - p.speed } });
      checkCollision(p);
    }
  },
  "move.right"(player) {
    const p = getPlayer(player);
    if (
      p.powerup.reverse
        ? p.x <= 0 + BRICK_WIDTH / 2
        : p.x >= GAME_WIDTH - BRICK_WIDTH / 2
    )
      return;
    else {
      Players.update({ player }, { $set: { x: p.x + p.speed } });
      checkCollision(p);
    }
  }
});
