import { Sprite, keyPressed } from 'kontra'

export const Player = ({ x, y }) => {
  let sprite = Sprite({
    x,
    y,
    anchor: { x: 0.5, y: 0.5 },
    color: 'blue',
    width: 40,
    height: 40,
  })

  const speed = 0.05

  return {
    sprite,
    shutdown() {},
    update() {
      sprite.ddx = 0
      sprite.ddy = 0
      if (keyPressed('up') || keyPressed('w')) {
        sprite.ddy = -speed
      }
      if (keyPressed('down') || keyPressed('s')) {
        sprite.ddy = speed
      }
      if (keyPressed('left') || keyPressed('a')) {
        sprite.ddx = -speed
      }
      if (keyPressed('right') || keyPressed('d')) {
        sprite.ddx = speed
      }
      sprite.update()
    },
    render() {
      sprite.render()
    },
  }
}
