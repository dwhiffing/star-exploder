window.muted = false
window.playSound = (sound) => !window.muted && zzfx(...sound)
window.toggleMute = () => (window.muted = !window.muted)
