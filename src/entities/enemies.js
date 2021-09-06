import { angleToTarget, Pool } from 'kontra'
import { getDist } from '../utils'
import { Bullets } from './bullets'
import { Sprite } from './sprite'

export const Enemies = (scene) => {
  const bullets = Bullets(scene)
  let pool = Pool({
    create: (...args) => new Enemy({ ...args, bullets, scene }),
    maxSize: ENEMY_COUNT,
  })

  return {
    pool,
    bullets,
    spawn({ x, y }) {
      console.log('spawn', x, y)
      // spawn on random size of map
      // const { width, height } = scene.context.canvas
      // let offsetX = width
      // let offsetY = 0
      // const dir = Math.floor(Math.random() * 4)
      // if (dir === 1) {
      //   offsetX = -width
      //   offsetY = 0
      // } else if (dir === 2) {
      //   offsetX = 0
      //   offsetY = -height
      // } else if (dir === 3) {
      //   offsetX = 0
      //   offsetY = height
      // }
      // const x = offsetX + scene.player.sprite.x + (Math.random() * width) / 2
      // const y = offsetY + scene.player.sprite.y + (Math.random() * height) / 2
      const enemy = pool.get({
        x,
        y,
        anchor: { x: 0.5, y: 0.5 },
        width: 30,
        height: 30,
        health: 5,
        target: scene.player.sprite,
        color: 'red',
      })
      if (!enemy) return
      if (!scene.children.includes(enemy)) {
        scene.addChild(enemy)
      }
    },
    destroy() {
      pool.clear()
    },
    update() {
      pool.update()
      bullets.update()
    },
    render() {
      pool.render()
    },
  }
}

const ENEMY_COUNT = 10

class Enemy extends Sprite {
  constructor(properties) {
    super(properties)
    this.bulletTimer = 0
    this.scene = properties.scene
    this.bullets = properties.bullets
  }

  die() {
    super.die()
    this.scene.pickups.get(this)
  }

  update() {
    super.update()
    if (!this.isAlive()) return
    if (this.bulletTimer > 0) this.bulletTimer--
    if (this.bulletTimer === 0) {
      this.bulletTimer = 100
      this.bullets.get(this, this.scene.player.sprite)
    }

    if (this.target) {
      const angle = angleToTarget(this, this.target) - 1.57
      const speed = getDist(this, this.target) < 100 ? 0 : 2
      this.dy = speed * Math.sin(angle)
      this.dx = speed * Math.cos(angle)
    }
  }
}
