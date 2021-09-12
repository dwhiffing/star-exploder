import { collides, getStoreItem, setStoreItem } from 'kontra'

// prettier-ignore
const SOUNDS = {
  // shoot: [, , 925, 0.04, 0.3, 0.6, 1, 0.3, , 6.27, -184, 0.09, 0.17],
  shoot: [,,463,,.02,.17,,2.07,-7,,,,,.9,,.4,.03,.69,.01,.18],
}

window.muted = false
window.playSound = (key) => !window.muted && SOUNDS[key] && zzfx(...SOUNDS[key])
window.toggleMute = () => (window.muted = !window.muted)

export const hashCode = function (str) {
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

export const COORDS = [
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

export const getDist = (source, target) => {
  const x = source.x - target.x
  const y = source.y - target.y
  return Math.sqrt(x * x + y * y)
}

export const checkCollisions = (groupA, groupB, onCollide) => {
  groupA.forEach((itemA) =>
    groupB.forEach((itemB) => {
      if (collides(itemA, itemB)) onCollide(itemA, itemB)
    }),
  )
}

export const getSeed = () => {
  const storedSeed = getStoreItem('seed')
  if (storedSeed) return storedSeed
  const seed = generateSeed()
  setStoreItem('seed', seed)
  return seed
}

const generateSeed = (length = 20) => {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function mkGradient({ ctx, r2, r1, c1, c2 }) {
  ctx.rect(0, 0, r2 * 2, r2 * 2)
  var g = ctx.createRadialGradient(r2, r2, r1, r2, r2, r2)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.fillStyle = g
  ctx.fill()
}
