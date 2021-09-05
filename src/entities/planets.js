import { hashCode } from '../utils'
import { Pool } from './pool'

export const Planets = (scene) => {
  let lastCoords = {}
  const { width, height } = scene.context.canvas
  const pool = new Pool(scene, {
    maxSize: 100,
    autoInit: true,
    update(x, y) {
      const scale = 100
      const chunkSize = 500
      const chunkX = Math.floor(x / chunkSize / scale)
      const chunkY = Math.floor(y / chunkSize / scale)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((planet, index) => {
        const seedBase = `seed-${index % (450 / 9)}`
        const x = (hashCode(`${seedBase}x`) % 100) / 100
        const y = (hashCode(`${seedBase}thatsthey`) % 100) / 100
        planet.x = x * chunkSize - chunkSize / 2 + width / 2
        planet.y = y * chunkSize - chunkSize / 2 + height / 2
        planet.color = 'red'
        const size = 20 * (hashCode(`${seedBase}size`) % 3)
        planet.width = size
        planet.height = size
      })
    },
  })
  return pool
}
