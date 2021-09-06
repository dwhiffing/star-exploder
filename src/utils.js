import { collides } from 'kontra'

window.muted = false
window.playSound = (sound) => !window.muted && zzfx(...sound)
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
