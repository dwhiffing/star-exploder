import { Pool } from './pool'

export const Pickups = (scene, opts = {}) => {
  const { size = 15, color = 'yellow' } = opts
  return new Pool(scene, {
    get({ x, y }) {
      const type = TYPES[Math.floor(Math.random() * 2)]
      return {
        x,
        y,
        color: type === 'gold' ? 'yellow' : 'white',
        anchor: { x: 0.5, y: 0.5 },
        type,
        item: { name: 'item' + Math.floor(Math.random() * 100) },
        width: size,
        height: size,
      }
    },
  })
}

const TYPES = ['gold', 'item']
