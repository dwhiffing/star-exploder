import { collides, getStoreItem, Scene, setStoreItem } from 'kontra'
import {
  Inventory,
  Enemies,
  Pickups,
  Player,
  Planets,
  Stars,
  GameMap,
  Hud,
} from '../entities'

export const GameScene = ({ canvas }) => {
  let scene = Scene({ id: 'game' })
  let stars = Stars(scene)
  let map = GameMap(scene)
  let hud = Hud(scene)
  let planets = Planets(scene)
  stars.objects.forEach((star) => scene.addChild(star))
  planets.objects.forEach((planet) => scene.addChild(planet))
  let player = Player({
    scene,
    x: canvas.width * (map.rowCount / 2),
    y: canvas.height * (map.rowCount / 2),
  })
  scene.addChild(player.sprite)

  let enemies = Enemies(scene)
  let pickups = Pickups(scene)
  let inventory = Inventory(scene)

  scene.player = player
  scene.pickups = pickups
  scene.enemies = enemies
  scene.map = map
  scene.hud = hud

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
      stars.update(scene.camera.x, scene.camera.y)
      planets.update(scene.camera.x, scene.camera.y)
      enemies.update()
      pickups.update()
      inventory.update()
      map.update()
      hud.update()
      scene.lookAt(player.sprite)

      checkCollisions(
        player.bullets.getAliveObjects(),
        [...planets.getAliveObjects(), ...enemies.pool.getAliveObjects()],
        (bullet, enemy) => {
          enemy.damage(1)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        enemies.bullets.getAliveObjects(),
        [player.sprite],
        (bullet, player) => {
          player.damage(1)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        planets.getAliveObjects(),
        [player.sprite],
        (planet, player) => {
          // player.damage(-1)
          planet.land()
        },
      )

      checkCollisions(
        pickups.getAliveObjects(),
        [player.sprite],
        (pickup, player) => {
          player.pickup(pickup)
          pickup.ttl = 0
        },
      )
    },
    render() {
      scene.render()
      hud.render()
      inventory.render()
      map.render()
    },
  }
}
