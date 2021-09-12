import { onPointerDown, Scene } from 'kontra'
import {
  Inventory,
  Station,
  Enemies,
  Pickups,
  Player,
  Planets,
  Stars,
  GameMap,
  Hud,
} from '../entities'
import { planetStats } from '../entities/planets'
import { checkCollisions, getSeed } from '../utils'
import '../../lib/zzfx'

export const GameScene = ({ canvas }) => {
  let scene = Scene({ id: 'game' })
  scene.seed = getSeed()
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
  let station = Station(scene)

  scene.player = player
  scene.pickups = pickups
  scene.planets = planets
  scene.enemies = enemies
  scene.station = station
  scene.map = map
  scene.hud = hud

  onPointerDown((e, object) => {
    if (!object) return
    const _player = player.sprite
    if (map.active) {
      const stats = planetStats(object._x, object._y, seed)
      if (stats.health > 0) return
      playSound('shoot')
      _player.x = stats.x
      _player.y = stats.y
      _player.dx = 0
      _player.dy = 0
    } else if (station.active) {
      if (object.type === 'store') {
        const currentLevel = player.sprite.upgrades[object.upgrade.key] || 1
        if (currentLevel >= object.upgrade.max) return
        const level = currentLevel + 1
        _player.setUpgrade(object.upgrade, level)
        // TODO: ensure can afford
        // _player.setGold(_player.gold - object.upgrade.getCost(level))
      }
    }
  })

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
      station.update()
      map.update()
      hud.update()
      scene.lookAt({
        x: player.sprite.x + (station.active ? 200 : 0),
        y: player.sprite.y,
      })

      checkCollisions(
        player.bullets.getAliveObjects(),
        [...planets.getAliveObjects(), ...enemies.pool.getAliveObjects()],
        (bullet, enemy) => {
          enemy.damage(bullet.damage)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        enemies.bullets.getAliveObjects(),
        [player.sprite],
        (bullet, player) => {
          player.damage(bullet.damage)
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
      station.render()
      inventory.render()
      map.render()
    },
  }
}
