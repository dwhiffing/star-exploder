import { Sprite as BaseSprite } from 'kontra'

export class Sprite extends BaseSprite.class {
  constructor(properties) {
    super(properties)
  }

  damage(n) {
    if (this.health <= 0) return
    this.health -= n
    if (this.health <= 0) {
      this.ttl = 0
    }
  }

  update() {
    super.update()
    this.opacity = this.isAlive() ? 1 : 0
  }
}
