import { collides, Scene } from 'kontra'
import {
  Inventory,
  Enemies,
  Pickups,
  Player,
  Stars,
  GameMap,
} from '../entities'

export const GameScene = ({ canvas }) => {
  let stars = Stars()

  let scene = Scene({
    id: 'game',
    children: [...stars.pool.objects],
  })

  let player = Player({ scene, x: canvas.width / 2, y: canvas.height / 2 })
  scene.addChild(player.sprite)

  let enemies = Enemies(scene)
  let pickups = Pickups(scene)
  let inventory = Inventory(scene)
  let map = GameMap(scene)

  scene.player = player
  scene.pickups = pickups

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
      pickups.update()
      inventory.update()
      map.update()
      scene.lookAt(player.sprite)

      checkCollisions(
        player.bullets.pool.getAliveObjects(),
        enemies.pool.getAliveObjects(),
        (bullet, enemy) => {
          enemy.damage(1)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        enemies.bullets.pool.getAliveObjects(),
        [player.sprite],
        (bullet, player) => {
          player.damage(1)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        pickups.pool.getAliveObjects(),
        [player.sprite],
        (pickup, player) => {
          player.pickup(pickup)
          pickup.ttl = 0
        },
      )
    },
    render() {
      scene.render()
      inventory.render()
      map.render()
    },
  }
}
