import { Pool } from './pool'

export const Pickups = (scene, opts = {}) => {
  const { size = 15, color = 'yellow' } = opts
  return new Pool(scene, {
    get({ x, y }) {
      return {
        x,
        y,
        color,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
      }
    },
  })
}
