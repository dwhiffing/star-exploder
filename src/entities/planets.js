import { Sprite, Pool } from 'kontra'
import { hashCode } from '../utils'

export const Planets = (scene) => {
  let pool = Pool({ create: Sprite, maxSize: 9 * 50 })
  let lastCoords = {}
  const { width, height } = scene.context.canvas
  for (let i = 0; i < 9 * 50; i += 1) {
    pool.get({ x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } })
  }

  return {
    pool,
    destroy() {
      pool.clear()
    },
    update(x, y) {
      pool.update()
      const scale = 100
      const chunkSize = 500
      const chunkX = Math.floor(x / chunkSize / scale)
      const chunkY = Math.floor(y / chunkSize / scale)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((planet, index) => {
        const stats = planetStats(index)
        planet.x = stats.x * chunkSize - chunkSize / 2 + width / 2
        planet.y = stats.y * chunkSize - chunkSize / 2 + height / 2
        planet.color = stats.color
        planet.width = stats.size
        planet.height = stats.size
      })
    },
    render() {
      pool.render()
    },
  }
}

const planetStats = (index) => {
  const seedBase = `seed-${index % (450 / 9)}`
  const x = (hashCode(`${seedBase}x`) % 100) / 100
  const y = (hashCode(`${seedBase}thatsthey`) % 100) / 100
  const color = 'red'
  const size = 20 * (hashCode(`${seedBase}size`) % 3)
  return { x, y, color, size }
}
