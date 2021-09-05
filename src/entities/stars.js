import { hashCode } from '../utils'
import { Pool } from './pool'

export const Stars = (scene) => {
  let lastCoords = {}
  const pool = new Pool(scene, {
    autoInit: true,
    maxSize: 9 * 50,
    update(x, y) {
      const chunkSize = scene.context.canvas.width
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }
      pool.objects.forEach((star, index) => {
        let chunkIndex = Math.floor(index / (pool.maxSize / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY

        const seedBase = `seed-${_x},${_y},${index % (pool.maxSize / 9)}`
        const x = (hashCode(`${seedBase}x`) % 100) / 100
        const y = (hashCode(`${seedBase}thatsthey`) % 100) / 100
        star.x = _x * chunkSize + (x * chunkSize - chunkSize / 2)
        star.y = _y * chunkSize + (y * chunkSize - chunkSize / 2)
        star.opacity = (hashCode(`${seedBase}alpha`) % 100) / 100
        star.color = COLORS[hashCode(`${seedBase}color`) % 10]
        const size = hashCode(`${seedBase}size`) % 5
        star.width = size
        star.height = size
      })
    },
  })

  return pool
}

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
const COORDS = [
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
