import { angleToTarget, keyPressed, Sprite, track } from 'kontra'
import { getDist } from '../utils'
import { planetStats, PLANET_CHUNK_FACTOR } from './planets'

export const GameMap = (scene) => {
  const { width, height } = scene.context.canvas
  let active = false
  const BUFFER = 40
  const BUFFER2 = 50
  let allowTrigger = true
  let lastChunkX = 0
  let lastChunkY = 0
  let lastOffsetX = null
  let lastOffsetY = null
  let planets = []
  const chunkSize = 8
  const rowCount = Math.floor((width - BUFFER2 * 2) / chunkSize)
  const updatePlanets = () => {
    const offsetX = Math.floor(lastChunkX / rowCount)
    const offsetY = Math.floor(lastChunkY / rowCount)
    if (offsetX === lastOffsetX && offsetY === lastOffsetY) return
    lastOffsetX = offsetX
    lastOffsetY = offsetY
    let i = 0
    planets.forEach((p) => (p.color = 'black'))
    for (let x = 0; x < rowCount; x++) {
      for (let y = 0; y < rowCount; y++) {
        const _x = x + offsetX * rowCount
        const _y = y + offsetY * rowCount
        const stats = planetStats(_x, _y, scene.seed, chunkSize)
        if (stats.isPlanet) {
          let planet = planets[i++]
          planet._x = _x
          planet._y = _y
          planet.x = BUFFER2 + x * chunkSize + chunkSize / 2
          planet.y = BUFFER2 + y * chunkSize + chunkSize / 2
          planet.color = stats.color
        }
      }
    }
  }

  let back = Sprite({
    x: BUFFER,
    y: BUFFER,
    width: width - BUFFER * 2,
    height: height - BUFFER * 2,
    color: '#333',
  })

  let board = Sprite({
    x: BUFFER2,
    y: BUFFER2,
    width: width - BUFFER2 * 2,
    height: height - BUFFER2 * 2,
    color: '#000',
  })

  for (let x = 0; x < 50; x++) {
    let planet = Sprite({
      x: 0,
      y: 0,
      color: 'black',
      anchor: { x: 0.5, y: 0.5 },
      width: chunkSize / 2,
      height: chunkSize / 2,
    })

    planets.push(planet)
    track(planet)
  }
  updatePlanets()

  let player = Sprite({
    x: 0,
    y: 0,
    anchor: { x: 0.5, y: 0.5 },
    width: chunkSize * 1.5,
    height: chunkSize * 1.5,
    color: 'blue',
  })

  return {
    get active() {
      return active
    },
    rowCount,
    forceUpdate() {
      lastOffsetX = null
      lastOffsetY = null
      updatePlanets()
    },
    updatePlanets,
    getClosest(sprite) {
      return planets
        .filter((p) => p.color !== 'black')
        .map((p) => {
          const f = width * PLANET_CHUNK_FACTOR
          const thing = { x: p._x * f + 400, y: p._y * f + 400 }
          const dist = getDist(thing, sprite)
          const angle = angleToTarget(thing, sprite) - 1.57
          return { ...p, dist, angle }
        })
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 4)
    },
    shutdown() {},
    update() {
      if (keyPressed('m')) {
        if (!allowTrigger) return
        active = !active
        if (active) {
          this.forceUpdate()
        }
        allowTrigger = false
      } else {
        allowTrigger = true
      }

      if (!active) return

      const { x, y } = this.getPlayerCoords()
      if (x === lastChunkX && y === lastChunkY) return
      lastChunkX = x
      lastChunkY = y

      player.x = BUFFER2 + mod(x, rowCount) * chunkSize + chunkSize / 2
      player.y = BUFFER2 + mod(y, rowCount) * chunkSize + chunkSize / 2

      updatePlanets()
    },
    render() {
      if (!active) return
      back.render()
      board.render()
      player.render()
      planets.forEach((planet) => planet.render())
    },
    getPlayerCoords() {
      const { x, y } = scene.player.sprite
      const { width, height } = scene.context.canvas
      return {
        x: Math.floor(x / (width * PLANET_CHUNK_FACTOR)),
        y: Math.floor(y / (height * PLANET_CHUNK_FACTOR)),
      }
    },
  }
}
const mod = (x, m) => ((x % m) + m) % m
