import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { GAME_TIME } from "../ui/components/config";

export const Time = new Mongo.Collection("time");

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;
}

Meteor.methods({
  "reset.timer"() {
    Time.update({}, { $set: { timer: GAME_TIME } }, { upsert: true });
  },
  "get.time"() {
    return Time.findOne({});
  }
});
