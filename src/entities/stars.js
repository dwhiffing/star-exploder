import { Sprite, Pool } from 'kontra'

export const Stars = () => {
  let pool = Pool({ create: Sprite, maxSize: 1000 })
  return {
    pool,
    add: (x, y, chunkIndex) =>
      pool.get({
        x,
        y,
        anchor: { x: 0.5, y: 0.5 },
        color: COLORS[chunkIndex],
        width: 20,
        height: 20,
      }),
    destroy() {
      pool.clear()
    },
    update() {
      pool.update()
    },
    render() {
      pool.render()
    },
  }
}

const COLORS = [
  'white',
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'cyan',
  'brown',
  'gray',
]
