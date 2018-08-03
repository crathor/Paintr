import { Meteor } from 'meteor/meteor'
import { Dimensions } from '../../api/dimensions'

Meteor.startup(() => {
  Dimensions.update({ height: 100, width: 100 }, { upsert: true })
})
