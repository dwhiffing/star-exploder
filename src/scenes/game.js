import { Scene } from 'kontra'
import { Player, Stars } from '../entities'

export const GameScene = ({ canvas }) => {
  let player = Player({ x: canvas.width / 2, y: canvas.height / 2 })
  let stars = Stars()

  let scene = Scene({
    id: 'game',
    children: [],
  })

  stars.pool.objects.forEach((o) => scene.addChild(o))

  scene.addChild(player.sprite)

  return {
    shutdown() {},
    update(dt) {
      player.update()
      scene.update()
      scene.lookAt(player.sprite)
      stars.update(scene.camera.x, scene.camera.y, canvas.width)
    },
    render() {
      scene.render()
    },
  }
}
