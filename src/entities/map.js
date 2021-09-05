import { keyPressed, Sprite } from 'kontra'
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
  let offsetX = 0
  let offsetY = 0
  let planets = []
  const chunkSize = 8
  const rowCount = Math.floor((width - BUFFER2 * 2) / chunkSize)

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

  for (let x = 0; x < 100; x++) {
    let planet = Sprite({
      x: 0,
      y: 0,
      anchor: { x: 0.5, y: 0.5 },
      width: chunkSize / 2,
      height: chunkSize / 2,
    })

    planets.push(planet)
  }

  let player = Sprite({
    x: 0,
    y: 0,
    anchor: { x: 0.5, y: 0.5 },
    width: chunkSize * 1.5,
    height: chunkSize * 1.5,
    color: 'blue',
  })

  return {
    rowCount,
    shutdown() {},
    update() {
      if (keyPressed('m')) {
        if (!allowTrigger) return
        active = !active
        allowTrigger = false
      } else {
        allowTrigger = true
      }

      if (!active) return

      const chunkX = Math.floor(
        scene.player.sprite.x /
          (scene.context.canvas.width * PLANET_CHUNK_FACTOR),
      )
      const chunkY = Math.floor(
        scene.player.sprite.y /
          (scene.context.canvas.width * PLANET_CHUNK_FACTOR),
      )
      if (chunkX === lastChunkX && chunkY === lastChunkY) return
      lastChunkX = chunkX
      lastChunkY = chunkY

      player.x = BUFFER2 + mod(chunkX, rowCount) * chunkSize + chunkSize / 2
      player.y = BUFFER2 + mod(chunkY, rowCount) * chunkSize + chunkSize / 2

      offsetX = Math.floor(chunkX / rowCount)
      offsetY = Math.floor(chunkY / rowCount)
      if (offsetX === lastOffsetX && offsetY === lastOffsetY) return
      lastOffsetX = offsetX
      lastOffsetY = offsetY
      planets.forEach((p) => {
        p.color = 'black'
      })
      let i = 0
      for (let x = 0; x < rowCount; x++) {
        for (let y = 0; y < rowCount; y++) {
          const _x = x + offsetX * rowCount
          const _y = y + offsetY * rowCount
          const stats = planetStats(_x, _y, chunkSize)
          if (stats.isPlanet) {
            let planet = planets[i]
            i++
            planet.x = BUFFER2 + x * chunkSize + chunkSize / 2
            planet.y = BUFFER2 + y * chunkSize + chunkSize / 2
            planet.color = stats.color
          }
        }
      }
    },
    render() {
      if (!active) return
      back.render()
      board.render()
      player.render()
      planets.forEach((planet) => planet.render())
    },
  }
}
const mod = (x, m) => ((x % m) + m) % m
