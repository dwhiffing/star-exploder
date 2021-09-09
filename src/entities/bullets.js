import { angleToTarget, randInt } from 'kontra'
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
        spread = 0.01,
        damage = 1,
      } = opts
      const angle =
        angleToTarget(start, target) - 1.57 + randInt(-2, 2) * spread
      const _speed = speed + randInt(-1, 1)
      return {
        x,
        y,
        color,
        damage,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
        dx: dx + _speed * Math.cos(angle),
        dy: dy + _speed * Math.sin(angle),
        ttl: 150,
      }
    },
  })
}
