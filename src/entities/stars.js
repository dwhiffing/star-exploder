import { hashCode } from '../utils'
import { Pool } from './pool'

export const Stars = (scene) => {
  const pool = new Pool(scene, {
    maxSize: STAR_COUNT,
    update(x, y) {
      const chunkSize = 800
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }
      pool.objects.forEach((star, index) => {
        let chunkIndex = Math.floor(index / (STAR_COUNT / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY

        const stats = starStats(_x, _y, index)
        star.x = _x * chunkSize + (stats.x * chunkSize - chunkSize / 2)
        star.y = _y * chunkSize + (stats.y * chunkSize - chunkSize / 2)
        star.opacity = stats.alpha
        star.color = stats.color
        star.width = stats.size
        star.height = stats.size
      })
    },
  })
  let lastCoords = {}
  for (let i = 0; i < STAR_COUNT; i += 1) {
    pool.get({ x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } })
  }
  return pool
}

export const STAR_COUNT = 9 * 50
const COLORS = [
  'white',
  'white',
  'white',
  'white',
  'white',
  'white',
  'white',
  'yellow',
  'blue',
  'red',
]
export const COORDS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

export const starStats = (_x, _y, index) => {
  const seedBase = `seed-${_x},${_y},${index % (STAR_COUNT / 9)}`
  const x = (hashCode(`${seedBase}x`) % 100) / 100
  const y = (hashCode(`${seedBase}thatsthey`) % 100) / 100
  const alpha = (hashCode(`${seedBase}alpha`) % 100) / 100
  const color = COLORS[hashCode(`${seedBase}color`) % 10]
  const size = hashCode(`${seedBase}size`) % 5
  return { x, y, alpha, color, size }
}
