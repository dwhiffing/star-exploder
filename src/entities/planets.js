import { getStoreItem, randInt, setStoreItem } from 'kontra'
import { COORDS, getDist, hashCode, gradient } from '../utils'
import { drawHealthBar, Sprite } from './sprite'
import { Pool } from './pool'

export const Planets = (scene, opts = {}) => {
  let lastCoords = {}
  let spawnTimer = 0
  const pool = new Pool(scene, {
    maxSize: 9,
    create: (...args) => new Planet(...args),
    autoInit: true,
    update(x, y) {
      const chunkSize = scene.context.canvas.width * PLANET_CHUNK_FACTOR
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (spawnTimer > 0) spawnTimer--
      else if (spawnTimer <= 0) {
        const planet = pool.objects
          .filter((p) => p.width > 0 && p.color !== 'blue')
          .map((p) => ({ p, dist: getDist(p, scene.player.sprite) }))
          .sort((a, b) => a.dist - b.dist)[0]?.p
        if (planet) {
          const { x, y, level = 1 } = planet
          spawnTimer = 700 - level * 100
          const maxSpawns = Math.floor(3 + level * 2)
          const enemiesPerSpawn = Math.floor(3 + level / 2)
          if (scene.enemies.pool.getAliveObjects().length < maxSpawns)
            scene.enemies.spawn({
              x,
              y,
              number: randInt(Math.floor(enemiesPerSpawn / 2), enemiesPerSpawn),
              level,
            })
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
  const isPlanet = hashCode(`${seedBase}`) % 223 === 0
  let health = 0
  let maxHealth = 0
  let upgradeType = 0
  let color = null
  let level = 0
  let size = 0
  if (isPlanet) {
    const store = getStoreItem('planets') || {}
    // distance calculation needs to ignore passed chunk size
    const realChunkSize = 800 * PLANET_CHUNK_FACTOR
    const realX = _x * realChunkSize + realChunkSize / 2
    const realY = _y * realChunkSize + realChunkSize / 2
    const distanceToCenter = getDist(
      { x: realX, y: realY },
      { x: 34800, y: 34800 },
    )
    level = Math.min(4, Math.floor(distanceToCenter / 30000) + 1)

    size = 200 + 50 * level
    const item = store[`${_x}-${_y}`] || {}
    health = item?.health
    index = item?.index
    maxHealth = [120, 240, 500, 1000][level - 1]
    health = typeof health === 'number' ? health : maxHealth
    color = health > 0 ? COLORS[level - 1] : 'blue'
    if (typeof index !== 'number' && health < maxHealth) {
      const store = getStoreItem('planets') || {}
      index = Object.keys(store).length - 1
      setStoreItem('planets', {
        ...store,
        [`${_x}-${_y}`]: { ...item, index: Object.keys(store).length - 1 },
      })
    }
    upgradeType = item?.index % 5 || 0
  }
  const final = {
    _x,
    _y,
    x,
    y,
    color,
    size,
    isPlanet,
    health,
    maxHealth,
    level,
    upgradeType,
    width: size,
    height: size,
  }
  statsCache[seedBase] = final
  return final
}

export const PLANET_CHUNK_FACTOR = 1

export class Planet extends Sprite {
  constructor(properties) {
    super(properties)
  }
  damage(n) {
    if (this.health <= 0) return
    super.damage(n)
    const planets = getStoreItem('planets') || {}
    const key = `${this._x}-${this._y}`
    setStoreItem('planets', {
      ...getStoreItem('planets'),
      [key]: { ...(planets[key] || {}), health: this.health },
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
    this.health = 0
    for (let i = 0; i < this.level * 20; i++) {
      const multi = randInt(0, 5) === 0 ? 2 : 1
      setTimeout(() => {
        this.parent.pickups.get({
          x: this.x + randInt(-100, 100),
          y: this.y + randInt(-100, 100),
          value: randInt(6, 10) * this.level * multi,
        })
      }, i * 10)
    }
    this.color = 'blue'
  }

  render() {
    if (this.size < 5) return
    if (this.health > 0) {
      drawHealthBar({
        ctx: this.context,
        x: this.x - this.width / 2,
        y: this.y - this.height / 1.5,
        width: this.width,
        ratio: this.health / this.maxHealth,
      })
    }
    var pad = 1.25
    // TODO: different colors for planets
    const canvas = mkStar({
      pad,
      r: this.size / 2,
      ...getColors(this.color),
    })

    this.context.drawImage(
      canvas,
      this.x - (this.size / 2) * pad,
      this.y - (this.size / 2) * pad,
    )
  }
}

const mkStar = (opts) => {
  var canvas = document.createElement('canvas')
  canvas.width = opts.r * (opts.pad * 2)
  canvas.height = opts.r * (opts.pad * 2)
  var ctx = canvas.getContext('2d')

  // Halo
  gradient({
    ctx: ctx,
    r1: opts.r,
    r2: opts.r * opts.pad,
    c1: opts.h1,
    c2: opts.h2,
  })

  // // Translate to edge of halo.
  var offset = opts.r * opts.pad - opts.r
  ctx.translate(offset, offset)
  ctx.save()

  /// Create planet outline clip
  ctx.beginPath()
  ctx.arc(opts.r, opts.r, opts.r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.clip()

  // Fill the ocean
  gradient({
    ctx: ctx,
    r1: 0,
    r2: opts.r,
    c1: opts.o2,
    c2: opts.o1,
  })

  // Add some atmosphere
  ctx.globalAlpha = 1
  gradient({
    ctx: ctx,
    r1: opts.r / 1.1,
    r2: opts.r,
    c1: 'rgba(255,255,255,0)',
    c2: 'rgba(255,255,255,.3)',
  })

  ctx.restore()

  return canvas
}

const COLORS = ['white', 'yellow', 'orange', 'red']

const getColors = (color) => {
  if (color === 'blue') {
    return {
      o1: '#3551dc',
      o2: '#0453d2',
      c2: '#0f52b4',
      c3: '#0051af',
      h1: 'rgba(0,81,175,1)',
      h2: 'rgba(0,81,175,0)',
    }
  }
  if (color === 'white') {
    return {
      o1: '#eeF5aa',
      o2: '#eeE3aa',
      c2: '#eeC7aa',
      c3: '#eeAFaa',
      h1: 'rgba(122,122,122,1)',
      h2: 'rgba(122,122,122,0)',
    }
  }
  if (color === 'yellow') {
    return {
      o1: '#FFF500',
      o2: '#FFE300',
      c2: '#FFC700',
      c3: '#FFAF00',
      h1: 'rgba(255,122,0,1)',
      h2: 'rgba(255,12,0,0)',
    }
  }
  if (color === 'orange') {
    return {
      o1: '#FFaa00',
      o2: '#FFaa00',
      c2: '#FFaa00',
      c3: '#FFaa00',
      h1: 'rgba(255,122,0,1)',
      h2: 'rgba(255,12,0,0)',
    }
  }
  if (color === 'red') {
    return {
      o1: '#Ff3300',
      o2: '#Ff3300',
      c2: '#Ff3300',
      c3: '#Ff3300',
      h1: 'rgba(200,12,0,1)',
      h2: 'rgba(200,112,0,0)',
    }
  }
}
