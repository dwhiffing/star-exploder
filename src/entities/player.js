import {
  getPointer,
  getStoreItem,
  keyPressed,
  pointerPressed,
  setStoreItem,
} from 'kontra'
import { Sprite } from './sprite'
import { Bullets } from './bullets'

const GUNS = {
  BASIC: {
    count: 1,
    delay: 30,
    speed: 5,
    size: 10,
    color: 'yellow',
    spread: 0,
    damage: 10,
  },
  MACHINE: {
    count: 1,
    delay: 2,
    speed: 5,
    size: 5,
    color: 'yellow',
    spread: 0.1,
    damage: 1,
  },
  SHOTGUN: {
    count: 5,
    delay: 20,
    speed: 10,
    size: 5,
    damage: 1,
    color: 'yellow',
    spread: 0.1,
  },
}

export const Player = ({ scene, x, y }) => {
  const speed = 0.1
  const breakSpeed = 1
  const maxSpeed = speed * 50
  const maxHealth = 100
  const gun = 'SHOTGUN'

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
    maxHealth: maxHealth,
    inventory: getStoreItem('player')?.inventory || [],
    gold: getStoreItem('player')?.gold || 0,
    health: getStoreItem('player')?.health || maxHealth,
  })
  const oldDamage = sprite.damage.bind(sprite)
  const damage = (n) => {
    oldDamage(n)
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, health: sprite.health })
  }
  sprite.damage = damage

  const setGold = (n = 1) => {
    sprite.gold = n
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, gold: sprite.gold })
  }
  sprite.setGold = setGold

  const pickup = (pickup) => {
    if (pickup.type === 'gold') {
      setGold(sprite.gold + 1)
    } else {
      getItem(pickup.item)
    }
  }
  sprite.pickup = pickup

  const getItem = (item) => {
    if (sprite.inventory.length >= 10) return
    sprite.inventory.push(item)
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, inventory: sprite.inventory })
    return true
  }
  sprite.getItem = getItem

  const removeItem = (item) => {
    sprite.inventory = sprite.inventory.filter(
      (_item) => _item?.name !== item?.name,
    )
    const current = getStoreItem('player') || {}
    setStoreItem('player', { ...current, inventory: sprite.inventory })
  }
  sprite.removeItem = removeItem

  return {
    sprite,
    bullets,
    shutdown() {},
    repair() {
      if (sprite.gold > 0) {
        pickup(-1)
        damage(-sprite.maxHealth + sprite.health)
      }
    },
    update() {
      sprite.ddx = 0
      sprite.ddy = 0
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
          sprite.health = sprite.maxHealth
          sprite.ttl = Infinity
        }, 1000)
      }

      if (bulletTimer > 0) bulletTimer--
      if (
        pointerPressed('left') &&
        bulletTimer === 0 &&
        !scene.station.active
      ) {
        bulletTimer = GUNS[gun].delay
        const pointer = getPointer()
        const x = sprite.x - width / 2 + pointer.x
        const y = sprite.y - height / 2 + pointer.y
        for (let i = 0; i < GUNS[gun].count; i++) {
          bullets.get(sprite, { x, y }, { ...GUNS[gun] })
        }
      }
    },
    render() {
      sprite.render()
    },
  }
}
