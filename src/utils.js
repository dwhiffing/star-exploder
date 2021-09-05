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
