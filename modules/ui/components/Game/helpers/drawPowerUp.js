export const drawPowerUp = (
  context,
  cx,
  cy,
  spikes,
  outerRadius,
  innerRadius
) => {
  var rot = (Math.PI / 2) * 3
  var x = cx
  var y = cy
  var step = Math.PI / spikes

  context.beginPath()
  context.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    context.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    context.lineTo(x, y)
    rot += step
  }
  context.lineTo(cx, cy - outerRadius)
  context.closePath()
  context.lineWidth = 3
  context.strokeStyle = 'black'
  context.stroke()
  context.fillStyle = '#d8c308'
  context.fill()
}
