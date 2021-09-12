import { Circle } from './bullets'
import { Pool } from './pool'

export const Pickups = (scene, opts = {}) => {
  const { size = 10 } = opts
  return new Pool(scene, {
    // autoInit: true,
    create: (...args) => new Circle(...args),
    get({ x, y }) {
      return {
        x,
        y,
        width: size,
        height: size,
      }
    },
  })
}
