import { getStoreItem, setStoreItem } from 'kontra'
import { COORDS, getDist, hashCode, mkGradient } from '../utils'
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
          .filter((p) => p.width > 0 && p.color !== 'blue')
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
const statsCache = {}
export const planetStats = (
  _x,
  _y,
  seed,
  chunkSize = 800 * PLANET_CHUNK_FACTOR,
) => {
  const seedBase = `${seed}-${_x},${_y}`
  if (statsCache[seedBase + chunkSize]) {
    return statsCache[seedBase + chunkSize]
  }
  const x = _x * chunkSize + chunkSize / 2
  const y = _y * chunkSize + chunkSize / 2
  const isPlanet = hashCode(`${seedBase}planet`) % 223 === 0
  let health = 0
  let upgradeType = 0
  let color = null
  let level = 0
  let size = 0
  if (isPlanet) {
    upgradeType = hashCode(`${seedBase}planet`) % 6
    const store = getStoreItem('planets') || {}
    // distance calculation needs to ignore passed chunk size
    const realChunkSize = 800 * PLANET_CHUNK_FACTOR
    const realX = _x * realChunkSize + realChunkSize / 2
    const realY = _y * realChunkSize + realChunkSize / 2
    const distanceToCenter = getDist(
      { x: realX, y: realY },
      { x: 34800, y: 34800 },
    )
    level = Math.floor(distanceToCenter / 30000) + 1
    size = 200 + 50 * level
    health = store[`${_x}-${_y}`]?.health
    health = typeof health === 'number' ? health : PLANET_HEALTH * level
    color = health > 0 ? 'red' : 'blue'
  }
  const final = {
    _x,
    _y,
    x,
    y,
    color,
    size: isPlanet ? size : 0,
    isPlanet,
    health,
    level,
    upgradeType,
    width: isPlanet ? size : 0,
    height: isPlanet ? size : 0,
  }
  statsCache[seedBase] = final
  return final
}

export const PLANET_CHUNK_FACTOR = 1

export class Planet extends Sprite {
  damage(n) {
    if (this.health <= 0) return
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
      this.color === 'blue'
    ) {
      this.parent.station.open(this)
      setStoreItem('last-planet', { x: this.x, y: this.y })
    }
  }
  die() {
    this.color = 'blue'
  }

  render() {
    if (this.size < 10) return
    const opts = {
      r: this.size / 2,
      o1: this.color === 'red' ? '#FFF500' : '#3551dc',
      o2: this.color === 'red' ? '#FFE300' : '#0453d2',
      c2: this.color === 'red' ? '#FFC700' : '#0f52b4',
      c3: this.color === 'red' ? '#FFAF00' : '#0051af',
      h1: this.color === 'red' ? 'rgba(255,122,0,1)' : 'rgba(0,81,175,1)',
      h2: this.color === 'red' ? 'rgba(255,12,0,0)' : 'rgba(0,81,175,0)',
    }

    var pad = 1.25
    var canvas = document.createElement('canvas')
    canvas.width = opts.r * (pad * 2)
    canvas.height = opts.r * (pad * 2)
    var ctx = canvas.getContext('2d')

    // Halo
    mkGradient({
      ctx: ctx,
      r1: opts.r,
      r2: opts.r * pad,
      c1: opts.h1,
      c2: opts.h2,
    })

    // // Translate to edge of halo.
    var offset = opts.r * pad - opts.r
    ctx.translate(offset, offset)
    ctx.save()

    /// Create planet outline clip
    ctx.beginPath()
    ctx.arc(opts.r, opts.r, opts.r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()

    // Fill the ocean
    mkGradient({
      ctx: ctx,
      r1: 0,
      r2: opts.r,
      c1: opts.o2,
      c2: opts.o1,
    })

    // Add some atmosphere
    ctx.globalAlpha = 1
    mkGradient({
      ctx: ctx,
      r1: opts.r / 1.1,
      r2: opts.r,
      c1: 'rgba(255,255,255,0)',
      c2: 'rgba(255,255,255,.3)',
    })

    ctx.restore()

    this.context.drawImage(
      canvas,
      this.x - (this.size / 2) * pad,
      this.y - (this.size / 2) * pad,
    )
  }
}
