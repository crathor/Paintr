import { Meteor } from "meteor/meteor";
import { Players } from "../../api/players";

Meteor.startup(() => {
  if (Players.find().count() === 0) {
    Players.insert({
      name: "cody",
      color: "blue",
      size: 10,
      speed: 10,
      y: 0,
      x: 0
    });
  }
});
