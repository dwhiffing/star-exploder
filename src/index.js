import { init, initPointer, initKeys, GameLoop } from 'kontra'
import { GameScene, MenuScene } from './scenes'
// import '../lib/zzfx'
// import '../lib/zzfxm'
// if (!window.muted && !musicPlaying) {
//   musicPlaying = true
//   let music = zzfxP(...zzfxM(...MUSIC[0]))
//   music.loop = true
// }

const { canvas } = init()

initPointer()
initKeys()

let scene

const newGame = () => {
  localStorage.clear()
  startGame()
}

const startGame = () => {
  scene && scene.shutdown()
  scene = GameScene({ canvas })
}

const startMenu = () => {
  scene && scene.shutdown()
  scene = MenuScene({ canvas, onNew: newGame, onContinue: startGame })
}
startMenu()
// startGame()

GameLoop({
  update: (...rest) => scene && scene.update(...rest),
  render: (...rest) => scene && scene.render(...rest),
}).start()
