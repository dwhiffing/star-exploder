import { Button, Sprite, Text, track } from 'kontra'

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
  let lastPlanet = null

  let back = Sprite({
    x: width / 2 + BUFFER,
    y: BUFFER,
    width: width / 2 - BUFFER * 2,
    height: height - BUFFER * 2,
    color: '#333',
  })

  let text = Text({
    text: 'Station',
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

  let button = Button({
    x: width / 2 + width / 4,
    y: height / 2 + 220,
    text: {
      text: 'Repair',
      color: 'white',
      font: '40px Arial, sans-serif',
      textAlign: 'center',
      anchor: { x: 0.5, y: 0.5 },
    },
    onDown() {
      scene.player.repair()
    },
  })
  return {
    get active() {
      return active
    },
    shutdown() {},
    open(planet) {
      if (this.active) return

      // TODO: take planet level into account
      active = true
      UPGRADES.filter(
        (upgrade) => true || UPGRADES[planet.upgradeType].key === upgrade.key,
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
        upgradeSlots[index].text =
          'Upgrade: ' +
          '\n' +
          upgrade.label +
          ' ' +
          (playerLevel + 1) +
          '\nCost: ' +
          upgrade.getCost(playerLevel)
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
      button.render()
      upgradeSlots.forEach((t) => t.render())
    },
  }
}

const baseGetCost =
  (baseCost = 10, rate = 1.4) =>
  (n) =>
    Math.round((baseCost * (Math.pow(rate, n + 1) - Math.pow(rate, n))) / rate)

export const UPGRADES = [
  {
    key: 'speed',
    label: 'Speed/manuvering',
    max: 5,
    getCost: baseGetCost(500, 3),
    apply: (n, sprite) => {
      sprite.stats.speed = 0.1 + n * 0.005
      sprite.stats.maxSpeed = sprite.stats.speed * (50 * n)
      sprite.stats.breakSpeed = n
    },
  },
  {
    key: 'health',
    label: 'Max Health',
    max: 10,
    getCost: baseGetCost(100, 2),
    apply: (n, sprite) => {
      sprite.stats.maxHealth = n * 100
      sprite.health = sprite.stats.maxHealth
    },
  },
  {
    key: 'gunpower',
    label: 'Gun Power',
    max: 9,
    getCost: baseGetCost(200, 2),
    apply: (n, sprite) => {
      sprite.stats.gundamage = ((n + 1) / 3) * 3
      sprite.stats.gunsize = 5 + n + 1
      sprite.stats.gunspeed = ((n + 1) / 3) * 2.5
    },
  },
  {
    key: 'gundelay',
    label: 'Gun Delay',
    max: 9,
    getCost: baseGetCost(200, 2),
    apply: (n, sprite) => {
      sprite.stats.gundelay = 5 + (28 - (n / 3) * 8)
    },
  },
  {
    key: 'guncount',
    label: 'Gun Bullets',
    max: 5,
    getCost: baseGetCost(200, 2),
    apply: (n, sprite) => {
      sprite.stats.guncount = n * 1
      sprite.stats.gunspread = 0.15
    },
  },
]
