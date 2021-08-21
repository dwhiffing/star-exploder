import { init, initPointer, GameLoop } from 'kontra'
import { createMenu } from './screens/menu'
import { createGame } from './screens/game'
import '../lib/zzfx'
import '../lib/zzfxm'

init()
initPointer()

let screen

const startGame = () => {
  screen && screen.shutdown()

  // if (!window.muted && !musicPlaying) {
  //   musicPlaying = true
  //   let music = zzfxP(...zzfxM(...MUSIC[0]))
  //   music.loop = true
  // }
  // screen = createWin(() => (screen = createMenu(startLevel)))
  screen = createGame()
}

screen = createMenu(startGame)

GameLoop({
  update: () => screen && screen.space.update(),
  render: () => screen && screen.space.render(),
}).start()
