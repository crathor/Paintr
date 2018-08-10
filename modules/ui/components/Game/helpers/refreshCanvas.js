export const refreshCanvas = (
  context,
  topLeftX,
  topLeftY,
  boxWidth,
  boxHeight,
  fillColor
) => {
  context.fillStyle = fillColor
  context.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}
refreshCanvas
