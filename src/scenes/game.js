import { Scene } from 'kontra'
import { Player, Stars } from '../entities'

export const GameScene = ({ canvas }) => {
  let player = Player({ x: canvas.width / 2, y: canvas.height / 2 })
  let stars = Stars()

  let scene = Scene({
    id: 'game',
    children: [],
  })
  for (let i = 0; i < 90; i += 1) {
    let chunkIndex = Math.floor(i / (90 / 9))
    scene.addChild(stars.add(0, 0, chunkIndex))
  }
  scene.addChild(player.sprite)
  const chunkSize = canvas.width / 3
  let currentChunkX
  let currentChunkY

  return {
    shutdown() {},
    update(dt) {
      const chunkY = Math.floor(scene.camera.y / chunkSize)
      const chunkX = Math.floor(scene.camera.x / chunkSize)
      if (currentChunkX !== chunkX || currentChunkY !== chunkY) {
        let objects = stars.pool.objects
        let xdir =
          chunkX === currentChunkX || !currentChunkX
            ? null
            : chunkX < currentChunkX
            ? 'left'
            : 'right'
        let ydir =
          chunkY === currentChunkY || !currentChunkY
            ? null
            : chunkY < currentChunkY
            ? 'up'
            : 'down'
        objects.forEach((i, index) => {
          let regenerate = false

          let chunkIndex = Math.floor(index / (90 / 9))
          let xOffset2 = 0
          let yOffset2 = 0

          if (xdir === 'left') {
            regenerate = chunkIndex % 3 === 0
            regenerate = chunkIndex === 5
            xOffset2 = -1 * chunkSize
            yOffset2 = 0
          }

          if (xdir === 'right') {
            regenerate = chunkIndex % 3 === 2
            xOffset2 = 1 * chunkSize
            yOffset2 = 0
          }

          if (ydir === 'up') {
            regenerate = chunkIndex === 7
          }

          if (ydir === 'down') {
            regenerate = chunkIndex === 1
          }

          if (
            typeof currentChunkX !== 'number' ||
            typeof currentChunkY !== 'number'
          ) {
            regenerate = true
          }

          if (regenerate) {
            const xOffset = (chunkIndex % 3) - 1
            const yOffset = Math.floor(chunkIndex / 3) - 1
            const _x = chunkSize
            const _y = chunkSize
            const X = 0.5 //Math.random()
            const Y = 0.5 //Math.random()
            i.x = _x * X + _x * xOffset + chunkX * chunkSize + xOffset2
            i.y = _y * Y + _y * yOffset + chunkY * chunkSize + yOffset2
            console.log(chunkIndex, xOffset, yOffset)
          }
        })

        currentChunkX = chunkX
        currentChunkY = chunkY
        console.log('new chunk', chunkX, chunkY)
      }
      player.update()
      scene.update()
      scene.lookAt(player.sprite)
      stars.update()
    },
    render() {
      scene.render()
      // stars.render()
    },
  }
}
