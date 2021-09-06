import {
  getPointer,
  getStoreItem,
  keyPressed,
  pointerPressed,
  setStoreItem,
} from 'kontra'
import { Sprite } from './sprite'
import { Bullets } from './bullets'

export const Player = ({ scene, x, y }) => {
  const speed = 0.15
  let bulletTimer = 0
  const bullets = Bullets(scene)
  const { width, height } = scene.context.canvas

  let sprite = new Sprite({
    x,
    y,
    anchor: { x: 0.5, y: 0.5 },
    color: 'blue',
    width: 30,
    height: 30,
    gold: getStoreItem('player')?.gold || 0,
    health: getStoreItem('player')?.health || 10,
  })
  const oldDamage = sprite.damage.bind(sprite)
  const damage = (n) => {
    oldDamage(n)
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, health: sprite.health })
  }
  sprite.damage = damage

  const pickup = () => {
    sprite.gold += 1
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, gold: sprite.gold })
  }
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
      if (keyPressed('space')) {
        sprite.dx = 0
        sprite.dy = 0
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
        bullets.get(sprite, { x, y })
      }
    },
    render() {
      sprite.render()
    },
  }
}
