import { keyPressed, Sprite } from 'kontra'
import { Planets } from './planets'

export const GameMap = (scene) => {
  const { width, height } = scene.context.canvas
  let active = false
  const BUFFER = 40
  const BUFFER2 = 50
  let allowTrigger = true

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
  let planets = Planets(scene)

  return {
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
      planets.update(scene.camera.x, scene.camera.y)
    },
    render() {
      if (!active) return
      back.render()
      board.render()
      planets.render()
    },
  }
}
