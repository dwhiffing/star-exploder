import { onPointerDown, Scene } from 'kontra'
import {
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

export const GameScene = ({ canvas, onWin }) => {
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
  let station = Station(scene)
  let playhitSound = true

  scene.player = player
  scene.pickups = pickups
  scene.planets = planets
  scene.enemies = enemies
  scene.station = station
  scene.map = map
  scene.hud = hud
  scene.onWin = onWin

  onPointerDown((e, object) => {
    if (!object) return
    const _player = player.sprite
    if (map.active) {
      const stats = planetStats(object._x, object._y, scene.seed)
      if (stats.health > 0) return
      playSound('teleport')
      _player.x = stats.x
      _player.y = stats.y
      _player.dx = 0
      _player.dy = 0
    } else if (station.active) {
      if (object.type === 'store') {
        const currentLevel = player.sprite.upgrades[object.upgrade.key] || 1
        const cost = object.upgrade.getCost(currentLevel + 1)
        if (currentLevel >= object.upgrade.max || _player.gold < cost) {
          playSound('deny')
          return
        }
        playSound('confirm')
        _player.setUpgrade(object.upgrade, currentLevel + 1)
        _player.setGold(_player.gold - cost)
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
      station.update()
      map.update()
      hud.update()
      scene.lookAt({
        x: player.sprite.x + (station.active ? 200 : 0),
        y: player.sprite.y,
      })

      checkCollisions(
        player.bullets.getAliveObjects(),
        [
          ...planets.getAliveObjects().filter((p) => p.color !== 'blue'),
          ...enemies.pool.getAliveObjects(),
        ],
        (bullet, enemy) => {
          enemy.damage(bullet.damage)
          bullet.ttl = 0
          if (playhitSound) {
            playhitSound = false
            setTimeout(() => (playhitSound = true), 100)
            playSound(enemy.isPlanet ? 'planetHit' : 'enemyHit')
          }
        },
      )

      checkCollisions(
        enemies.bullets.getAliveObjects(),
        [player.sprite],
        (bullet, player) => {
          playSound('playerHit')
          player.damage(bullet.damage)
          bullet.ttl = 0
        },
      )

      checkCollisions(
        planets.getAliveObjects(),
        [player.sprite],
        (planet, player) => {
          planet.land()
        },
      )

      checkCollisions(
        pickups.getAliveObjects(),
        [player.sprite],
        (pickup, player) => {
          player.setGold(player.gold + pickup.value)
          hud.setText(pickup.value)
          playSound('pickup')
          pickup.ttl = 0
        },
      )
    },
    render() {
      player.thrust.render()
      scene.render()
      hud.render()
      station.render()
      map.render()
    },
  }
}
