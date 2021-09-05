import { COORDS, hashCode } from '../utils'
import { Pool } from './pool'

export const Planets = (scene, opts = {}) => {
  let lastCoords = {}
  const pool = new Pool(scene, {
    maxSize: 9,
    autoInit: true,
    update(x, y) {
      const chunkSize = scene.context.canvas.width * PLANET_CHUNK_FACTOR
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((planet, index) => {
        let chunkIndex = Math.floor(index / (pool.maxSize / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY
        const stats = planetStats(_x, _y, chunkSize)
        planet.x = stats.x
        planet.y = stats.y
        planet.color = stats.color
        planet.width = stats.isPlanet ? stats.size : 0
        planet.height = stats.isPlanet ? stats.size : 0
      })
    },
  })
  return pool
}

export const planetStats = (_x, _y, chunkSize) => {
  const seedBase = `thisistheplanetseedokay-${_x},${_y}`
  const x = _x * chunkSize + chunkSize / 2
  const y = _y * chunkSize + chunkSize / 2
  const color = 'white'
  const size = 200 + 10 * (hashCode(`${seedBase}size`) % 5)
  const isPlanet = hashCode(`${seedBase}planet`) % 223 === 0

  return { x, y, color, size, isPlanet }
}

export const PLANET_CHUNK_FACTOR = 1
