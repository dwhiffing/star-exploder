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

  let inventory = []
  let itemSlots = []
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
    itemSlots.push(slot)
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
    get inventory() {
      return inventory
    },
    set inventory(v) {
      inventory = v
    },
    shutdown() {},
    open(planet) {
      if (this.active) return
      active = !active
      if (planet._x === lastPlanet?._x && planet._y === lastPlanet?._y) return
      lastPlanet = { _x: planet._x, _y: planet._y }
      inventory = [
        { name: 'item' + Math.floor(Math.random() * 100) },
        { name: 'item' + Math.floor(Math.random() * 100) },
        { name: 'item' + Math.floor(Math.random() * 100) },
      ]
    },
    update() {
      if (active) {
        itemSlots.forEach((s) => (s.text = ''))
        inventory.forEach((item, index) => {
          itemSlots[index].text = item?.name || ''
          itemSlots[index].y = 150 + index * 20
        })
      }
      active = false
    },
    render() {
      if (!active) return
      back.render()
      text.render()
      button.render()
      itemSlots.forEach((t) => t.render())
    },
  }
}
