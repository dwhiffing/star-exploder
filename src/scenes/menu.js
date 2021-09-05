import { Button, Text } from 'kontra'

export const MenuScene = ({ canvas, onDown }) => {
  const { width, height } = canvas

  let text = Text({
    text: 'Space',
    font: '150px Arial',
    color: '#555',
    x: width / 2,
    y: height / 2 - 250,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let text2 = Text({
    text: 'By Daniel Whiffing',
    font: '24px Arial',
    color: '#333',
    x: width / 2,
    y: height / 2,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let button = Button({
    x: width / 2,
    y: height / 2 + 150,
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
