import { Pool } from 'kontra'
import { Sprite } from './sprite'

export const Pickups = (scene, opts = {}) => {
  let pool = Pool({
    create: (...args) => new Sprite(...args),
    maxSize: PICKUP_COUNT,
  })
  const { size = 15, color = 'yellow' } = opts
  return {
    pool,
    get(start) {
      const { x, y } = start
      const pickup = pool.get({
        x,
        y,
        color,
        anchor: { x: 0.5, y: 0.5 },
        width: size,
        height: size,
      })

      if (!pickup) return
      if (!scene.children.includes(pickup)) {
        scene.addChild(pickup)
      }
    },
    destroy() {
      pool.clear()
    },
    update() {
      pool.update()
    },
    spawn(start, target) {
      this.get(start, target)
    },
    render() {
      pool.render()
    },
  }
}

const PICKUP_COUNT = 20
