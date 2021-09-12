import { angleToTarget, off, randInt } from 'kontra'
import { Pool } from './pool'

export const Bullets = (scene) => {
  return new Pool(scene, {
    maxSize: 300,
    get(start, target, opts = {}) {
      const { x, y, dy, dx } = start
      const {
        size = 5,
        color = 'yellow',
        speed = 8,
        count = 1,
        damage = 1,
        spread = 0,
        index = 0,
      } = opts

      const offset = index * spread - spread * (count / 2)
      const angle = angleToTarget(start, target) - 1.57 + offset
      return {
        x,
        y,
        color,
        damage,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
        dx: dx + speed * Math.cos(angle),
        dy: dy + speed * Math.sin(angle),
        ttl: 150,
      }
    },
  })
}
