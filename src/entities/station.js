import { Sprite, Text } from 'kontra'

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
    text: 'Station',
    x: width / 2 + width / 4,
    y: height / 2 - 250,
    ...base,
  })
  return {
    get active() {
      return active
    },
    shutdown() {},
    open() {
      if (active) return
      active = !active
      if (active) {
        // text.text = `Gold: ${scene.player.sprite.gold}`
      }
    },
    update() {
      active = false
    },
    render() {
      if (!active) return
      back.render()
      text.render()
    },
  }
}
