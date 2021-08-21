import { Button, Text } from 'kontra'

export const WinScene = (onDown) => {
  return {
    shutdown() {},
    update() {},
    render() {
      let text = Text({
        text: 'You win!',
        font: '68px Arial',
        color: '#333',
        x: 708,
        y: 200,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
      })
      let button = Button({
        x: 650,
        y: 550,
        text: {
          text: 'Back to Menu',
          color: 'white',
          font: '20px Arial, sans-serif',
          anchor: { x: 0.5, y: 0.5 },
        },
        onDown() {
          onDown()
        },
      })

      text.render()
      button.render()
    },
  }
}
