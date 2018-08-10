export const drawPlayer = (context, centerX, centerY, radius, fillColor) => {
  context.fillStyle = fillColor
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
  context.fill()
  context.lineWidth = 2
  context.strokeStyle = '#000000'
  context.stroke()
}
