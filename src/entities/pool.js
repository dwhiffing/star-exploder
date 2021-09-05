import { Pool as BasePool } from 'kontra'
import { Sprite } from './sprite'

export class Pool extends BasePool.class {
  constructor(
    scene,
    { create = (...args) => new Sprite(...args), maxSize = 100, ...opts } = {},
  ) {
    super({ create, maxSize })
    this.scene = scene
    this.opts = opts
  }

  get(...args) {
    if (!this.opts.get) {
      return super.get(...args)
    }
    const sprite = super.get(this.opts.get(...args))
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
