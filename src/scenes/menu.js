import { Button, Text } from 'kontra'

export const MenuScene = (onDown) => {
  let text = Text({
    text: 'Space',
    font: '150px Arial',
    color: '#555',
    x: 400,
    y: 240,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let text2 = Text({
    text: 'By Daniel Whiffing',
    font: '24px Arial',
    color: '#333',
    x: 400,
    y: 430,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let button = Button({
    x: 400,
    y: 550,
    text: {
      text: 'Start Game',
      color: 'white',
      font: '40px Arial, sans-serif',
      textAlign: 'center',
      anchor: { x: 0.5, y: 0.5 },
    },
    onDown() {
      onDown()
    },
  })
  return {
    shutdown() {
      button.destroy()
    },
    update() {},
    render() {
      text.render()
      text2.render()
      button.render()
    },
  }
}
