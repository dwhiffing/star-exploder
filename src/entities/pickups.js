import { Circle } from './bullets'
import { Pool } from './pool'

export const Pickups = (scene, opts = {}) => {
  return new Pool(scene, {
    create: (...args) => new Circle(...args),
    get({ x, y, value = 1 }) {
      const size = value < 50 ? (value < 10 ? 5 : 10) : 15
      return {
        x,
        y,
        value,
        width: size,
        height: size,
        ttl: 2000,
      }
    },
  })
}
