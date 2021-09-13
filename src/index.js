import { init, initPointer, initKeys, GameLoop } from 'kontra'
import { GameScene, MenuScene } from './scenes'
import { WinScene } from './scenes/win'

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
  scene = GameScene({ canvas, onWin: startWin })
}

const startMenu = () => {
  scene && scene.shutdown()
  scene = MenuScene({ canvas, onNew: newGame, onContinue: startGame })
}

const startWin = () => {
  scene && scene.shutdown()
  scene = WinScene({ canvas, onNew: newGame })
}
startMenu()

GameLoop({
  update: (...rest) => scene && scene.update(...rest),
  render: (...rest) => scene && scene.render(...rest),
}).start()
