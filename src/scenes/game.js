import { Scene } from 'kontra'
import { Player, Stars, Bullets } from '../entities'

export const GameScene = ({ canvas }) => {
  let player = Player({ x: canvas.width / 2, y: canvas.height / 2 })
  let stars = Stars()

  let scene = Scene({
    id: 'game',
    children: [...stars.pool.objects, player.sprite],
  })
  scene.player = player
  let bullets = Bullets(scene)

  return {
    shutdown() {},
    update(dt) {
      player.update()
      scene.update()
      stars.update(scene.camera.x, scene.camera.y, canvas.width)
      bullets.update()
      scene.lookAt(player.sprite)
    },
    render() {
      scene.render()
    },
  }
}
