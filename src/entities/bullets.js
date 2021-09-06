import { angleToTarget } from 'kontra'
import { Pool } from './pool'

export const Bullets = (scene, opts = {}) => {
  const { size = 5, color = 'yellow' } = opts
  return new Pool(scene, {
    get(start, target, speed = 8) {
      const { x, y, dy, dx } = start
      const angle = angleToTarget(start, target) - 1.57
      return {
        x,
        y,
        color,
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
