import { angleToTarget, Pool, randInt } from 'kontra'
import { getDist } from '../utils'
import { Bullets } from './bullets'
import { ShipSprite } from './sprite'

export const Enemies = (scene) => {
  const bullets = Bullets(scene)
  let pool = Pool({
    create: (...args) => new Enemy({ ...args, bullets, scene }),
    maxSize: ENEMY_COUNT,
  })

  return {
    pool,
    bullets,
    spawn({ x, y, number = 1, level = 1 }) {
      for (let i = 0; i < number; i++) {
        const enemy = pool.get({
          x,
          y,
          anchor: { x: 0.5, y: 0.5 },
          width: 35,
          height: 35,
          level,
          health: 10 * level + randInt(0, 10 * level),
          strength: 1 * level,
          speed: 1 + 0.1 * level,
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

const ENEMY_COUNT = 20

class Enemy extends ShipSprite {
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

  getNewTarget(dist = 50) {
    const { x, y } = this.scene.player.sprite
    return { x: x + randInt(-dist, dist), y: y + randInt(-dist, dist) }
  }

  update() {
    super.update()
    if (!this.isAlive()) return
    if (this.bulletTimer > 0) this.bulletTimer--
    if (this.bulletTimer === 0) {
      this.bulletTimer = 400 - this.level * 80 + randInt(-100, 100)
      this.bullets.get(this, this.getNewTarget(), { damage: this.strength })
    }

    if (!this.target) {
      this.target = this.getNewTarget(400)
    }
    const distToTarget = getDist(this, this.target)
    const angle = angleToTarget(this, this.target) - 1.57
    const speed =
      distToTarget <= 200 || getDist(this, this.scene.player.sprite) < 100
        ? 0
        : this.speed
    this.dy = speed * Math.sin(angle)
    this.dx = speed * Math.cos(angle)

    if (distToTarget <= 200) {
      if (this.triggered) return
      setTimeout(() => {
        this.triggered = false
        this.target = this.getNewTarget(400)
      }, randInt(500, 1500))
      this.triggered = true
    }
  }
}
