import { Sprite, Pool } from 'kontra'

export const Stars = () => {
  let pool = Pool({ create: Sprite, maxSize: STAR_COUNT })
  let lastCoords = {}
  for (let i = 0; i < STAR_COUNT; i += 1) {
    pool.get({ x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } })
  }

  return {
    pool,
    destroy() {
      pool.clear()
    },
    update(x, y, chunkSize) {
      pool.update()
      const chunkX = Math.floor(x / chunkSize)
      const chunkY = Math.floor(y / chunkSize)

      if (lastCoords.x === chunkX && lastCoords.y === chunkY) return
      lastCoords = { x: chunkX, y: chunkY }

      pool.objects.forEach((star, index) => {
        let chunkIndex = Math.floor(index / (STAR_COUNT / 9))
        const _x = COORDS[chunkIndex][0] + chunkX
        const _y = COORDS[chunkIndex][1] + chunkY

        const seedBase = `seed-${_x},${_y},${index % (STAR_COUNT / 9)}`
        const x = (hashCode(`${seedBase}x`) % 100) / 100
        const y = (hashCode(`${seedBase}thatsthey`) % 100) / 100
        const alpha = (hashCode(`${seedBase}alpha`) % 100) / 100
        const color = hashCode(`${seedBase}color`) % 10
        const size = hashCode(`${seedBase}size`) % 5

        star.x = _x * chunkSize + (x * chunkSize - chunkSize / 2)
        star.y = _y * chunkSize + (y * chunkSize - chunkSize / 2)
        star.opacity = alpha
        star.color = COLORS[color]
        star.width = size
        star.height = size
      })
    },
    render() {
      pool.render()
    },
  }
}

const STAR_COUNT = 9 * 200
const COLORS = [
  'white',
  'white',
  'white',
  'white',
  'white',
  'white',
  'white',
  'yellow',
  'blue',
  'red',
]
const COORDS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

const hashCode = function (str) {
  var hash = 0
  if (str.length === 0) {
    return hash
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}
