import { angleToTarget } from 'kontra'
import { gradient } from '../utils'
import { Pool } from './pool'
import { Sprite } from './sprite'

export const Bullets = (scene) => {
  return new Pool(scene, {
    create: (...args) => new Circle(...args),
    maxSize: 300,
    autoInit: true,
    get(start, target, opts = {}) {
      const { x, y, dy, dx } = start
      const {
        size = 5,
        speed = 8,
        count = 1,
        damage = 1,
        spread = 0,
        index = 0,
      } = opts

      const offset = index * spread - spread * (count / 2)
      const angle = target ? angleToTarget(start, target) - 1.57 + offset : 0
      return {
        x,
        y,
        r: 255,
        g: 255,
        b: 90,
        damage,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
        dx: dx + speed * Math.cos(angle),
        dy: dy + speed * Math.sin(angle),
        ttl: 200,
      }
    },
  })
}

export class Circle extends Sprite {
  constructor(properties) {
    super(properties)
    this.r = this.r || '255'
    this.g = this.g || '255'
    this.b = this.b || '255'
  }

  draw() {
    gradient({
      x: 0 + -this.width * 1.2,
      y: 0 + -this.width * 1.2,
      ctx: this.context,
      r1: this.width / 2,
      r2: this.width * 1.2,
      c1: `rgba(${this.r},${this.g},${this.b},1)`,
      c2: `rgba(${this.r},${this.g},${this.b},0)`,
    })
  }
}
