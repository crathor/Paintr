import { Meteor } from 'meteor/meteor'
import { GameBoard } from '../../api/gameboard'
import { BRICK_GRID } from '../../ui/components/config'

Meteor.startup(() => {
  if (!GameBoard.findOne()) {
    BRICK_GRID.forEach(brick => {
      GameBoard.insert({ color: '#f4f4f4', powerup: false })
    })
  }
})
