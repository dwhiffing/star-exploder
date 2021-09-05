import { getPointer, keyPressed, pointerPressed } from 'kontra'
import { Sprite } from './sprite'
import { Bullets } from './bullets'

export const Player = ({ scene, x, y }) => {
  const speed = 0.05
  let bulletTimer = 0
  const bullets = Bullets(scene)
  const { width, height } = scene.context.canvas
  const gold = 0

  let sprite = new Sprite({
    x,
    y,
    health: 10,
    anchor: { x: 0.5, y: 0.5 },
    color: 'blue',
    width: 40,
    height: 40,
  })

  const pickup = () => (gold += 1)
  sprite.pickup = pickup

  return {
    sprite,
    bullets,
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
      bullets.update()

      if (sprite.health <= 0) {
        setTimeout(() => {
          sprite.health = 10
          sprite.ttl = Infinity
        }, 1000)
      }

      if (bulletTimer > 0) bulletTimer--
      if (pointerPressed('left') && bulletTimer === 0) {
        bulletTimer = 10
        const pointer = getPointer()
        const x = sprite.x - width / 2 + pointer.x
        const y = sprite.y - height / 2 + pointer.y
        bullets.shoot(sprite, { x, y })
      }
    },
    render() {
      sprite.render()
    },
  }
}
