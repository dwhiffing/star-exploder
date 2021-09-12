import { randInt, Sprite as BaseSprite } from 'kontra'
import { gradient } from '../utils'

export class Sprite extends BaseSprite.class {
  constructor(properties) {
    super(properties)
  }

  damage(n) {
    if (this.health <= 0) return
    this.health -= n
    if (this.health <= 0) {
      this.die()
    }
  }

  die() {
    this.ttl = 0
  }

  update() {
    super.update()
    this.opacity = this.isAlive() ? 1 : 0
  }
}

export class ShipSprite extends Sprite {
  constructor(properties) {
    super(properties)
    this.strobeTimer = 10
  }

  draw() {
    this.strobeTimer--
    const pad = 1.2 + (this.strobeTimer <= 5 ? 0.25 : 0.2)
    if (this.strobeTimer <= 0) this.strobeTimer = 10
    gradient({
      x: 15 + -this.width * pad,
      y: 15 + -this.width * pad,
      ctx: this.context,
      r1: this.width * 0.5,
      r2: this.width * pad,
      c1: 'rgba(170,170,255,1)',
      c2: 'rgba(170,170,255,0)',
    })
    this.context.fillStyle = this.color
    this.context.lineWidth = 3
    this.context.strokeStyle = '#222'
    this.context.beginPath()
    this.context.arc(15, 15, this.width, 0, 2 * Math.PI)
    this.context.closePath()
    this.context.stroke()
    this.context.fill()
    this.context.beginPath()
    this.context.fillStyle = '#111'
    this.context.arc(15, 15, this.width / 2, 0, 2 * Math.PI)
    this.context.fill()
    this.context.lineWidth = 1
    this.context.strokeStyle = '#555'
    this.context.stroke()
  }
}
