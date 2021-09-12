import {
  getPointer,
  getStoreItem,
  keyPressed,
  pointerPressed,
  setStoreItem,
} from 'kontra'
import { Sprite } from './sprite'
import { Bullets } from './bullets'
import { UPGRADES } from './station'

export const Player = ({ scene, x, y }) => {
  const upgrades = getStoreItem('player')?.upgrades || {}

  let bulletTimer = 0
  const bullets = Bullets(scene)
  const { width, height } = scene.context.canvas
  const lastPlanet = getStoreItem('last-planet')
  let sprite = new Sprite({
    x: lastPlanet?.x || x,
    y: lastPlanet?.y || y,
    anchor: { x: 0.5, y: 0.5 },
    color: 'blue',
    width: 30,
    height: 30,
    gold: getStoreItem('player')?.gold || 0,
    upgrades: upgrades,
    health: getStoreItem('player')?.health || 100,
    stats: {
      speed: 0.1,
      breakSpeed: 1,
      maxSpeed: 0.1 * 50,
      maxHealth: 100,
      guncount: 1,
      gundelay: 30,
      gunspeed: 5,
      gunsize: 5,
      guncolor: 'yellow',
      gunspread: 0,
      gundamage: 10,
    },
  })

  Object.entries(upgrades).forEach(([k, v]) => {
    const upgrade = UPGRADES.find((u) => u.key === k)
    upgrade.apply(v, sprite)
  })

  const oldDamage = sprite.damage.bind(sprite)
  const damage = (n) => {
    oldDamage(n)
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, health: sprite.health })
  }
  sprite.damage = damage
  const setUpgrade = (upgrade, value) => {
    upgrade.apply(value, sprite)
    sprite.upgrades[upgrade.key] = value
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, upgrades: sprite.upgrades })
  }
  sprite.setUpgrade = setUpgrade

  const setGold = (n = 1) => {
    sprite.gold = n
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, gold: sprite.gold })
  }
  sprite.setGold = setGold

  const pickup = (pickup) => {
    setGold(sprite.gold + 1)
  }
  sprite.pickup = pickup

  return {
    sprite,
    bullets,
    shutdown() {},
    repair() {
      if (sprite.gold > 0) {
        pickup(-1)
        damage(-sprite.stats.maxHealth + sprite.health)
      }
    },
    update() {
      sprite.ddx = 0
      sprite.ddy = 0
      const { speed, maxSpeed, breakSpeed } = sprite.stats
      if (keyPressed('up') || keyPressed('w')) {
        if (sprite.dy > -maxSpeed) sprite.ddy = -speed
      }
      if (keyPressed('down') || keyPressed('s')) {
        if (sprite.dy < maxSpeed) sprite.ddy = speed
      }
      if (keyPressed('left') || keyPressed('a')) {
        if (sprite.dx > -maxSpeed) sprite.ddx = -speed
      }
      if (keyPressed('right') || keyPressed('d')) {
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

      if (sprite.health <= 0) {
        setTimeout(() => {
          sprite.health = sprite.stats.maxHealth
          sprite.ttl = Infinity
        }, 1000)
      }

      if (bulletTimer > 0) bulletTimer--
      if (pointerPressed('left') && bulletTimer <= 0 && !scene.station.active) {
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
      }
    },
    render() {
      sprite.render()
    },
  }
}
