import { getStoreItem, setStoreItem } from 'kontra'
import { COORDS, getDist, hashCode } from '../utils'
import { Sprite } from './sprite'
import { Pool } from './pool'

const SPAWN_TIME = 200

export const Planets = (scene, opts = {}) => {
  let lastCoords = {}
  let spawnTimer = SPAWN_TIME
  const pool = new Pool(scene, {
    maxSize: 9,
    create: (...args) => new Planet(...args),
    autoInit: true,
    update(x, y) {
      const chunkSize = scene.context.canvas.width * PLANET_CHUNK_FACTOR
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (spawnTimer > 0) spawnTimer--
      else if (spawnTimer === 0) {
        const sorted = pool.objects
          .filter((p) => p.width > 0)
          .map((p) => ({ p, dist: getDist(p, scene.player.sprite) }))
          .sort((a, b) => a.dist - b.dist)
        if (sorted[0] && sorted[0].p.color !== 'blue')
          scene.enemies.spawn(sorted[0].p)
        spawnTimer = SPAWN_TIME
      }

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((planet, index) => {
        let chunkIndex = Math.floor(index / (pool.maxSize / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY
        const stats = planetStats(_x, _y, chunkSize)
        planet.x = stats.x
        planet.y = stats.y
        planet._x = _x
        planet._y = _y
        planet.health = stats.health
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
  const size = 200 + 10 * (hashCode(`${seedBase}size`) % 5)
  const isPlanet = hashCode(`${seedBase}planet`) % 223 === 0
  const store = getStoreItem('planets') || {}
  let health = store[`${_x}-${_y}`]?.health
  health = typeof health === 'number' ? health : 10
  const color = health > 0 ? 'red' : 'blue'

  return { x, y, color, size, isPlanet, health }
}

export const PLANET_CHUNK_FACTOR = 1

export class Planet extends Sprite {
  damage(n) {
    super.damage(n)
    setStoreItem('planets', {
      ...getStoreItem('planets'),
      [`${this._x}-${this._y}`]: { health: this.health },
    })
    this.parent?.map.forceUpdate()
  }
  die() {
    this.color = 'blue'
  }
}
