import {
  getPointer,
  getStoreItem,
  keyPressed,
  pointerPressed,
  setStoreItem,
} from 'kontra'
import { ShipSprite } from './sprite'
import { Bullets, Circle } from './bullets'
import { UPGRADES } from './station'

export const Player = ({ scene, x: originX, y: originY }) => {
  const upgrades = getStoreItem('starexploder:player')?.upgrades || {}

  let bulletTimer = 0
  const bullets = Bullets(scene)
  const { width, height } = scene.context.canvas
  const lastPlanet = getStoreItem('starexploder:last-planet')
  let sprite = new ShipSprite({
    x: lastPlanet?.x || originX,
    y: lastPlanet?.y || originY,
    anchor: { x: 0.5, y: 0.5 },
    color: '#666',
    width: 50,
    height: 50,
    gold: getStoreItem('starexploder:player')?.gold || 0,
    upgrades: upgrades,
    health: getStoreItem('starexploder:player')?.health || 100,
    stats: {
      speed: 0.1,
      breakSpeed: 1,
      maxSpeed: 0.1 * 50,
      maxHealth: 100,
      guncount: 1,
      gundelay: 20,
      gunspeed: 9,
      gunsize: 5,
      guncolor: 'white',
      gunspread: 0,
      gundamage: 5,
    },
  })

  let thrust = new Circle({
    width: 15,
    height: 15,
    r: 200,
    g: 200,
    b: 255,
  })

  Object.entries(upgrades).forEach(([k, v]) => {
    const upgrade = UPGRADES.find((u) => u.key === k)
    upgrade.apply(v, sprite)
  })

  sprite.healthBar = true
  sprite.maxHealth = sprite.stats.maxHealth

  const oldDamage = sprite.damage.bind(sprite)
  const damage = (n) => {
    oldDamage(n)
    const current = getStoreItem('starexploder:player') || {}
    setStoreItem('starexploder:player', { ...current, health: sprite.health })
  }
  sprite.damage = damage
  const setUpgrade = (upgrade, value) => {
    upgrade.apply(value, sprite)
    sprite.upgrades[upgrade.key] = value
    const current = getStoreItem('starexploder:player') || {}
    setStoreItem('starexploder:player', {
      ...current,
      upgrades: sprite.upgrades,
    })
  }
  sprite.setUpgrade = setUpgrade

  const setGold = (n = 1) => {
    sprite.gold = n
    const current = getStoreItem('starexploder:player') || {}
    setStoreItem('starexploder:player', { ...current, gold: sprite.gold })
  }
  sprite.setGold = setGold

  return {
    sprite,
    thrust,
    bullets,
    shutdown() {},

    repair() {
      if (sprite.stats.maxHealth === sprite.health) return
      playSound('repair')

      damage(-sprite.stats.maxHealth + sprite.health)
    },
    shoot() {
      bulletTimer = sprite.stats.gundelay
      const pointer = getPointer()
      const x = sprite.x - width / 2 + pointer.x
      const y = sprite.y - height / 2 + pointer.y
      const size = sprite.stats.gunsize
      const color = sprite.stats.guncolor
      const speed = sprite.stats.gunspeed
      const spread = sprite.stats.gunspread
      const damage = sprite.stats.gundamage
      const count = sprite.stats.guncount
      for (let i = 0; i < count; i++) {
        bullets.get(
          sprite,
          { x, y },
          { size, color, speed, spread, damage, index: i, count },
        )
      }
    },
    move(dir) {
      thrust.scaleX = 1
      thrust.x = 400 + (dir === 0 || dir === 2 ? 0 : dir === 1 ? -24 : 24)
      thrust.y = 400 + (dir === 1 || dir === 3 ? 0 : dir === 2 ? -24 : 24)
    },
    update() {
      sprite.ddx = 0
      sprite.ddy = 0
      const { speed, maxSpeed, breakSpeed } = sprite.stats
      thrust.scaleX = 0

      if (keyPressed('n') && !this.triggered) {
        setTimeout(() => (this.triggered = false), 1000)
        window.toggleMute()
        this.triggered = true
      }

      if (keyPressed('up') || keyPressed('w')) {
        this.move(0)
        if (sprite.dy > -maxSpeed) sprite.ddy = -speed
      }
      if (keyPressed('down') || keyPressed('s')) {
        this.move(2)
        if (sprite.dy < maxSpeed) sprite.ddy = speed
      }
      if (keyPressed('left') || keyPressed('a')) {
        this.move(3)
        if (sprite.dx > -maxSpeed) sprite.ddx = -speed
      }
      if (keyPressed('right') || keyPressed('d')) {
        this.move(1)
        if (sprite.dx < maxSpeed) sprite.ddx = speed
      }
      if (keyPressed('space')) {
        const _breakSpeed = speed * breakSpeed
        sprite.dx += sprite.dx > 0 ? -_breakSpeed : _breakSpeed
        sprite.dy += sprite.dy > 0 ? -_breakSpeed : _breakSpeed
        if (Math.abs(sprite.dx) < 1) sprite.dx = 0
        if (Math.abs(sprite.dy) < 1) sprite.dy = 0
      }
      sprite.update()
      bullets.update()

      if (sprite.health <= 0 && !sprite.deathTriggered) {
        scene.enemies.pool.objects.forEach((o) => (o.ttl = 0))
        sprite.deathTriggered = true
        playSound('playerDie')

        setTimeout(() => {
          sprite.deathTriggered = false
          sprite.x = lastPlanet?.x || originX
          sprite.y = lastPlanet?.y || originY
          sprite.health = sprite.stats.maxHealth
          sprite.ttl = Infinity
          sprite.gold = Math.floor(sprite.gold / 2)
        }, 1000)
      }

      if (bulletTimer > 0) bulletTimer--
      if (
        pointerPressed('left') &&
        sprite.health > 0 &&
        bulletTimer <= 0 &&
        !scene.station.active
      ) {
        playSound('shoot')
        this.shoot()
      }
    },
  }
}
