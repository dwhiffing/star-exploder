import { Pool } from 'kontra'
import { Sprite } from './sprite'

export const Bullets = (scene, opts = {}) => {
  let pool = Pool({
    create: (...args) => new Sprite(...args),
    maxSize: BULLET_COUNT,
  })
  const { size = 10, color = 'purple' } = opts
  return {
    pool,
    get(start, target, speed = 8) {
      const { x, y, dy, dx } = start
      const angle = Math.atan2(x - target.x, y - target.y)
      const bullet = pool.get({
        x,
        y,
        color,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
        dx: dx + -speed * Math.sin(angle),
        dy: dy + -speed * Math.cos(angle),
        ttl: 90,
      })

      if (!bullet) return
      if (!scene.children.includes(bullet)) {
        scene.addChild(bullet)
      }
    },
    destroy() {
      pool.clear()
    },
    update() {
      pool.update()
    },
    shoot(start, target) {
      this.get(start, target)
    },
    render() {
      pool.render()
    },
  }
}

const BULLET_COUNT = 20
