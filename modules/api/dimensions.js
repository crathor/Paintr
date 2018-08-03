import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const Dimensions = new Mongo.Collection('dimensions')

Meteor.methods({
  'add.dimensions'(height, width) {
    Dimensions.update({}, { $set: { height, width } }, { upsert: true })
  },
  'dimensions.height'() {
    console.log(Dimensions.findOne({}))
  }
})
