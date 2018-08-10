export const getWinner = (bricks, players) => {
  const brickColors = bricks.map(brick => brick.color)
  const playerScores = players
    .map(player => {
      const count = brickColors.filter(color => color === player.color).length
      return {
        ...player,
        count
      }
    })
    .sort((a, b) => a.count < b.count)
  return playerScores[0]
}
