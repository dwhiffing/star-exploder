import { keyPressed, Sprite, Text } from 'kontra'

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
    y: height / 2 - 250,
    ...base,
  })
  return {
    shutdown() {},
    update() {
      if (keyPressed('e')) {
        if (!allowTrigger) return
        active = !active
        if (active) {
          text.text = `Gold: ${scene.player.sprite.gold}`
        }
        allowTrigger = false
      } else {
        allowTrigger = true
      }
    },
    render() {
      if (!active) return
      back.render()
      text.render()
    },
  }
}
