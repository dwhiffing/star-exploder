import { getStoreItem, setStoreItem } from 'kontra'
import { COORDS, getDist, hashCode } from '../utils'
import { Sprite } from './sprite'
import { Pool } from './pool'

const SPAWN_TIME = 500
const PLANET_HEALTH = 50

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
          .filter((p) => p.width > 0 && p.color !== '#0000aa')
          .map((p) => ({ p, dist: getDist(p, scene.player.sprite) }))
          .sort((a, b) => a.dist - b.dist)
        if (sorted[0]) {
          const { x, y, level = 1 } = sorted[0].p
          scene.enemies.spawn({ x, y, level })
          spawnTimer = SPAWN_TIME - level * 25
        } else {
          spawnTimer = SPAWN_TIME
        }
      }

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((planet, index) => {
        let chunkIndex = Math.floor(index / (pool.maxSize / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY
        const stats = planetStats(_x, _y, scene.seed, chunkSize)
        for (let k in stats) {
          planet[k] = stats[k]
        }
      })
    },
  })
  return pool
}

// TODO: should assign a level to a planet based on distance from origin
// level will scale planet health, items for sale, enemy spawn rate, and enemy level
// enemy level will determine speed, health, and damage
export const planetStats = (
  _x,
  _y,
  seed,
  chunkSize = 800 * PLANET_CHUNK_FACTOR,
) => {
  if (!seed) console.log(seed)
  const seedBase = `${seed}-${_x},${_y}`
  const x = _x * chunkSize + chunkSize / 2
  const y = _y * chunkSize + chunkSize / 2
  const size = 200 + 10 * (hashCode(`${seedBase}size`) % 5)
  const isPlanet = hashCode(`${seedBase}planet`) % 223 === 0
  const upgradeType = hashCode(`${seedBase}planet`) % 6
  const store = getStoreItem('planets') || {}
  // distance calculation needs to ignore passed chunk size
  const realChunkSize = 800 * PLANET_CHUNK_FACTOR
  const realX = _x * realChunkSize + realChunkSize / 2
  const realY = _y * realChunkSize + realChunkSize / 2
  const distanceToCenter = getDist(
    { x: realX, y: realY },
    { x: 34800, y: 34800 },
  )
  const level = Math.floor(distanceToCenter / 30000) + 1
  let health = isPlanet ? store[`${_x}-${_y}`]?.health : 0
  health = typeof health === 'number' ? health : PLANET_HEALTH * level
  const color = health > 0 ? COLORS[level - 1] : '#0000aa'

  return {
    _x,
    _y,
    x,
    y,
    color,
    size,
    isPlanet,
    health,
    level,
    upgradeType,
    width: isPlanet ? size : 0,
    height: isPlanet ? size : 0,
  }
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
  land() {
    if (
      this.width > 0 &&
      !this.parent.station.active &&
      this.color === '#0000aa'
    ) {
      this.parent.station.open(this)
      setStoreItem('last-planet', { x: this.x, y: this.y })
    }
  }
  die() {
    this.color = '#0000aa'
  }
}

const COLORS = ['#aa0000', '#aa4400', 'yellow', 'white', 'white', 'white']
