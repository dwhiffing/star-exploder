import { Button, Text } from 'kontra'

export const MenuScene = ({ canvas, onNew, onContinue }) => {
  const { width, height } = canvas

  let text = Text({
    text: 'Star Exploder',
    font: '110px sans-serif',
    color: '#555',
    x: width / 2,
    y: height / 2 - 180,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let text2 = Text({
    text: 'By Daniel Whiffing',
    font: '24px sans-serif',
    color: '#333',
    x: width / 2,
    y: height / 2 - 80,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })
  let button = Button({
    x: width / 2,
    y: height / 2 + 150,
    text: {
      text: 'New Game',
      color: 'white',
      font: '40px sans-serif',
      textAlign: 'center',
      anchor: { x: 0.5, y: 0.5 },
    },
    onDown() {
      onNew()
    },
  })
  let button2
  if (localStorage.getItem('starexploder:planets')) {
    button2 = Button({
      x: width / 2,
      y: height / 2 + 220,
      text: {
        text: 'Continue',
        color: 'white',
        font: '40px sans-serif',
        textAlign: 'center',
        anchor: { x: 0.5, y: 0.5 },
      },
      onDown() {
        onContinue()
      },
    })
  }
  return {
    shutdown() {
      button.destroy()
      button2?.destroy()
    },
    update() {},
    render() {
      text.render()
      text2.render()
      button.render()
      button2?.render()
    },
  }
}
