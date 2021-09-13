import { Sprite, Text, track } from 'kontra'
import { getSeed, hashCode } from '../utils'

export const Station = (scene) => {
  const { width, height } = scene.context.canvas
  let active = true
  const BUFFER = 40
  const base = {
    font: '20px Arial',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  }

  let back = Sprite({
    x: width / 2 + BUFFER,
    y: BUFFER,
    width: width / 2 - BUFFER * 2,
    height: height - BUFFER * 2,
    color: '#333',
  })

  let text = Text({
    text: 'Money:',
    x: width / 2 + width / 4,
    y: height / 2 - 300,
    ...base,
  })

  let upgradeSlots = []
  for (let i = 0; i < 40; i++) {
    let slot = Text({
      text: '',
      x: width / 2 + width / 4,
      y: 0,
      type: 'store',
      ...base,
      anchor: { x: 0.5, y: 0 },
    })
    track(slot)
    upgradeSlots.push(slot)
  }

  return {
    get active() {
      return active
    },
    shutdown() {},
    open(planet) {
      if (this.active) return

      active = true
      scene.player.repair()
      text.text = `Money: ${scene.player.sprite.gold}`
      UPGRADES.filter(
        (upgrade) => UPGRADES[planet.upgradeType].key === upgrade.key,
      ).forEach((upgrade, index) => {
        const playerLevel = scene.player.sprite.upgrades[upgrade.key] || 1
        upgradeSlots[index].upgrade = upgrade
        upgradeSlots[index].y = 150 + index * 70
        if (playerLevel >= upgrade.max) {
          upgradeSlots[index].opacity = 0.5
          upgradeSlots[index].text =
            'Upgrade: ' + '\n' + upgrade.label + ' ' + playerLevel + ' MAX'
          return
        }
        const cost = upgrade.getCost(playerLevel + 1)
        upgradeSlots[index].opacity = scene.player.sprite.gold < cost ? 0.5 : 1
        upgradeSlots[index].text =
          'Upgrade: ' +
          '\n' +
          upgrade.label +
          ' ' +
          (playerLevel + 1) +
          '\nCost: ' +
          cost
      })
    },
    update() {
      active = false

      if (!active) return
    },
    render() {
      if (!active) return
      back.render()
      text.render()
      upgradeSlots.forEach((t) => t.render())
    },
  }
}

const baseGetCost =
  (baseCost = 10, rate = 1.4) =>
  (n) =>
    Math.round((baseCost * (Math.pow(rate, n) - Math.pow(rate, n - 1))) / rate)

export const UPGRADES = shuffle([
  {
    key: 'speed',
    label: 'Speed/manuvering',
    max: 4,
    getCost: baseGetCost(500, 5),
    apply: (n, sprite) => {
      sprite.stats.speed = 0.1 + n * 0.005
      sprite.stats.maxSpeed = sprite.stats.speed * (50 * n)
      sprite.stats.breakSpeed = n
    },
  },
  {
    key: 'health',
    label: 'Max Health',
    max: 5,
    getCost: baseGetCost(100, 2.5),
    apply: (n, sprite) => {
      sprite.stats.maxHealth = n * 100
      sprite.health = sprite.stats.maxHealth
      sprite.maxHealth = sprite.stats.maxHealth
    },
  },
  {
    key: 'gunpower',
    label: 'Gun Power',
    max: 6,
    getCost: baseGetCost(200, 3),
    apply: (n, sprite) => {
      sprite.stats.gundamage = 7 * n
      sprite.stats.gunsize = 5 + n
    },
  },
  {
    key: 'gundelay',
    label: 'Gun Delay',
    max: 4,
    getCost: baseGetCost(200, 4),
    apply: (n, sprite) => {
      sprite.stats.gundelay = 5 + (30 - n * 5)
    },
  },
  {
    key: 'guncount',
    label: 'Gun Bullets',
    max: 3,
    getCost: baseGetCost(200, 5),
    apply: (n, sprite) => {
      sprite.stats.guncount = n * 1
      sprite.stats.gunspread = 0.15
    },
  },
])

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(
      (hashCode(getSeed()) * currentIndex) % array.length,
    )
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}
