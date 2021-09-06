import { keyPressed, Sprite, Text, track } from 'kontra'

export const Inventory = (scene) => {
  const { width, height } = scene.context.canvas
  let active = false
  const BUFFER = 40
  let allowTrigger = true
  const base = {
    font: '20px Arial',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  }

  let back = Sprite({
    x: BUFFER,
    y: BUFFER,
    width: width / 2 - BUFFER * 2,
    height: height - BUFFER * 2,
    color: '#333',
  })

  let text = Text({
    text: 'Gold',
    x: width / 4,
    y: height / 2 - 300,
    ...base,
  })

  let itemSlots = []
  for (let i = 0; i < 40; i++) {
    let slot = Text({
      text: '',
      x: width / 4,
      y: 0,
      type: 'player',
      ...base,
      anchor: { x: 0.5, y: 0 },
    })
    track(slot)
    itemSlots.push(slot)
  }

  return {
    get active() {
      return active
    },
    shutdown() {},
    update() {
      if (keyPressed('e')) {
        if (!allowTrigger) return
        active = !active
        allowTrigger = false
      } else {
        allowTrigger = true
      }

      if (!active) return

      text.text = `Gold: ${scene.player.sprite.gold}`
      itemSlots.forEach((s) => (s.text = ''))
      scene.player.sprite.inventory.forEach((item, index) => {
        itemSlots[index].text = item?.name || ''
        itemSlots[index].y = 150 + index * 20
      })
    },
    render() {
      if (!active) return
      back.render()
      text.render()
      itemSlots.forEach((t) => t.render())
    },
  }
}
