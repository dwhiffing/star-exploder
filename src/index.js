import { init, initPointer, initKeys, GameLoop, Pool } from 'kontra'
import { GameScene } from './scenes'
// import '../lib/zzfx'
// import '../lib/zzfxm'
// if (!window.muted && !musicPlaying) {
//   musicPlaying = true
//   let music = zzfxP(...zzfxM(...MUSIC[0]))
//   music.loop = true
// }
// screen = createWin(() => (screen = createMenu(startLevel)))

const { canvas } = init()

initPointer()
initKeys()

let scene

const startGame = () => {
  // scene && scene.shutdown()
  scene = GameScene({ canvas })
}

startGame()
// scene = createMenu(startGame)

GameLoop({
  update: (...rest) => scene && scene.update(...rest),
  render: (...rest) => scene && scene.render(...rest),
}).start()
