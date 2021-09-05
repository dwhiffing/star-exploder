import { collides, Scene } from 'kontra'
import { Player, Stars } from '../entities'
import { Enemies } from '../entities/enemies'

export const GameScene = ({ canvas }) => {
  let stars = Stars()

  let scene = Scene({
    id: 'game',
    children: [...stars.pool.objects],
  })

  let player = Player({ scene, x: canvas.width / 2, y: canvas.height / 2 })
  scene.addChild(player.sprite)
  scene.player = player
  let enemies = Enemies(scene)

  const checkCollisions = (groupA, groupB, onCollide) => {
    groupA.forEach((itemA) =>
      groupB.forEach((itemB) => {
        if (collides(itemA, itemB)) onCollide(itemA, itemB)
      }),
    )
  }

  return {
    shutdown() {},
    update() {
      player.update()
      scene.update()
      stars.update(scene.camera.x, scene.camera.y, canvas.width)
      enemies.update()
      scene.lookAt(player.sprite)

      checkCollisions(
        player.bullets.pool.getAliveObjects(),
        enemies.pool.getAliveObjects(),
        (bullet, enemy) => {
          if (!bullet.isAlive() || !enemy.isAlive()) return
          enemy.damage(1)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        enemies.bullets.pool.getAliveObjects(),
        [player.sprite],
        (bullet, player) => {
          if (!bullet.isAlive() || !player.isAlive()) return
          player.damage(1)
          bullet.ttl = 0
        },
      )
    },
    render() {
      scene.render()
    },
  }
}
