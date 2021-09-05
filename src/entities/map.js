import { keyPressed, Sprite } from 'kontra'
import { planetStats, PLANET_CHUNK_FACTOR } from './planets'

export const GameMap = (scene) => {
  const { width, height } = scene.context.canvas
  let active = false
  const BUFFER = 40
  const BUFFER2 = 50
  let allowTrigger = true
  let planets = []
  const chunkSize = 8
  const rowCount = (width - BUFFER2 * 2) / chunkSize

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

  for (let x = 0; x < rowCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const stats = planetStats(x, y, chunkSize)
      if (stats.isPlanet) {
        let planet = Sprite({
          x: BUFFER2 + x * chunkSize + chunkSize / 2,
          y: BUFFER2 + y * chunkSize + chunkSize / 2,
          anchor: { x: 0.5, y: 0.5 },
          width: chunkSize / 2,
          height: chunkSize / 2,
          color: 'white',
        })

        planets.push(planet)
      }
    }
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
      player.x = BUFFER2 + chunkX * chunkSize + chunkSize / 2
      player.y = BUFFER2 + chunkY * chunkSize + chunkSize / 2
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
