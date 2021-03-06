import { clamp, GameObject, Text } from 'kontra'

export const Hud = (scene) => {
  let arrows = []

  for (let x = 0; x < 10; x++) {
    let arrow = new Triangle({
      x: 0,
      y: 0,
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      width: 13,
      height: 6,
    })

    arrows.push(arrow)
  }
  // TODO: fix arrows when planet too far away
  let money = Text({
    text: '',
    font: '14px Arial',
    color: '#fff',
    x: 400,
    y: 330,
    anchor: { x: 0.5, y: 0.5 },
    textAlign: 'center',
  })

  return {
    shutdown() {},
    setText(text) {
      money.text = `Money: ${text}`
      setTimeout(() => (money.text = ''), 2000)
    },
    update() {
      const closest = scene.map.getClosest(scene.player.sprite)
      closest.slice(0, 9).forEach((planet, i) => {
        arrows[i].x = Math.cos(planet.angle) * -60 + 400
        arrows[i].y = Math.sin(planet.angle) * -60 + 400
        arrows[i].rotation = planet.angle + 1.57
        arrows[i].color = planet.color
        arrows[i].opacity = Math.max(0, 1 - planet.dist / 15000)
        const mult = 2 - clamp(1, planet.dist / 5000, 2.5)
        arrows[i].width = 13 * mult
        arrows[i].height = 6 * mult
      })
    },
    render() {
      arrows.forEach((arrow) => arrow.render())
      money.render()
    },
  }
}

export class Triangle extends GameObject.class {
  constructor(properties) {
    super(properties)
  }

  draw() {
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.moveTo(0, 0)
    this.context.lineTo(this.width, 0)
    this.context.lineTo(this.width / 2, this.height)
    this.context.fill()
  }
}
