import { Pool } from './pool'

export const Bullets = (scene, opts = {}) => {
  const { size = 10, color = 'purple' } = opts
  return new Pool(scene, {
    get(start, target, speed = 8) {
      const { x, y, dy, dx } = start
      const angle = Math.atan2(x - target.x, y - target.y)
      return {
        x,
        y,
        color,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
        dx: dx + -speed * Math.sin(angle),
        dy: dy + -speed * Math.cos(angle),
        ttl: 150,
      }
    },
  })
}
