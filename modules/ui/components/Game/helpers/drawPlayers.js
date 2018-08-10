import { drawPlayer } from './drawPlayer'

export const drawPlayers = (players, context) => {
  if (players.length > 0) {
    //   this.player = players.find(
    //     player => player.player === Meteor.userId()
    //   )
    players.forEach(player => {
      drawPlayer(context, player.x, player.y, player.size, player.color)
    })
  }
}
