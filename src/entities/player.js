import {
  getPointer,
  getStoreItem,
  keyPressed,
  pointerPressed,
  setStoreItem,
} from 'kontra'
import { Sprite } from './sprite'
import { Bullets } from './bullets'

const BASE_MAX = 20
export const Player = ({ scene, x, y }) => {
  const speed = 0.15
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
    maxHealth: BASE_MAX,
    inventory: getStoreItem('player')?.inventory || [],
    gold: getStoreItem('player')?.gold || 0,
    health: getStoreItem('player')?.health || BASE_MAX,
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
        sprite.ddy = -speed
      }
      if (keyPressed('down') || keyPressed('s')) {
        sprite.ddy = speed
      }
      if (keyPressed('left') || keyPressed('a')) {
        sprite.ddx = -speed
      }
      if (keyPressed('right') || keyPressed('d')) {
        sprite.ddx = speed
      }
      if (keyPressed('space')) {
        sprite.dx = 0
        sprite.dy = 0
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
        bulletTimer = 10
        const pointer = getPointer()
        const x = sprite.x - width / 2 + pointer.x
        const y = sprite.y - height / 2 + pointer.y
        bullets.get(sprite, { x, y })
      }
    },
    render() {
      sprite.render()
    },
  }
}
