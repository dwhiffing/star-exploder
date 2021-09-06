import { Pool as BasePool } from 'kontra'
import { Sprite } from './sprite'

export class Pool extends BasePool.class {
  constructor(
    scene,
    {
      create = (...args) => new Sprite(...args),
      maxSize = 100,
      autoInit,
      ...opts
    } = {},
  ) {
    super({ create, maxSize })
    this.scene = scene
    this.opts = opts
    if (autoInit) {
      for (let i = 0; i < maxSize; i += 1) {
        this.get({ x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } })
      }
    }
  }

  get(...args) {
    if (!this.opts.get) {
      return super.get(...args)
    }
    const sprite = super.get(this.opts.get(...args))
    sprite.scene = this.scene
    if (!sprite) return
    if (!this.scene.children.includes(sprite)) {
      this.scene.addChild(sprite)
    }
  }

  update(...args) {
    super.update(...args)
    if (this.opts.update) {
      return this.opts.update(...args)
    }
  }
}
