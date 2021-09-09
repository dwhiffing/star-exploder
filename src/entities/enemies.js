import { angleToTarget, Pool, randInt } from 'kontra'
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
    spawn({ x, y, number = 1 }) {
      for (let i = 0; i < number; i++) {
        const enemy = pool.get({
          x,
          y,
          anchor: { x: 0.5, y: 0.5 },
          width: 30,
          height: 30,
          health: 5,
          color: 'red',
        })
        if (!enemy) return
        if (!scene.children.includes(enemy)) {
          scene.addChild(enemy)
        }
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
    this.waitTimer = 0
    this.scene = properties.scene
    this.bullets = properties.bullets
  }

  die() {
    super.die()
    this.scene.pickups.get(this)
  }

  getNewTarget() {
    const { x, y } = this.scene.player.sprite
    return { x: x + randInt(-100, 100), y: y + randInt(-100, 100) }
  }

  update() {
    super.update()
    if (!this.isAlive()) return
    if (this.bulletTimer > 0) this.bulletTimer--
    if (this.bulletTimer === 0) {
      this.bulletTimer = 100
      this.bullets.get(this, this.getNewTarget())
    }

    if (!this.target) {
      this.target = this.getNewTarget()
    }
    const distToTarget = getDist(this, this.target)

    const angle = angleToTarget(this, this.target) - 1.57
    const speed = distToTarget < 100 ? 0 : 2
    this.dy = speed * Math.sin(angle)
    this.dx = speed * Math.cos(angle)

    if (distToTarget < 100) {
      setTimeout(() => {
        this.target = this.getNewTarget()
      }, randInt(200, 1000))
    }
  }
}
