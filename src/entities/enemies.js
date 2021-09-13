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
        const health = 15 + Math.pow(4, level)
        setTimeout(() => {
          const enemy = pool.get({
            x,
            y,
            anchor: { x: 0.5, y: 0.5 },
            width: 30 + level * 5,
            height: 30 + level * 5,
            level,
            healthBar: true,
            health,
            ttl: Infinity,
            maxHealth: health,
            strength: 5 + 1 * level,
            speed: 1 + level / 1.5,
            color: ['white', 'yellow', 'orange', 'red'][level - 1],
          })
          if (!enemy) return
          playSound('spawn')
          if (!scene.children.includes(enemy)) {
            scene.addChild(enemy)
          }
        }, i * 500)
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

const ENEMY_COUNT = 50

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
    playSound('enemyDie')
    if (randInt(0, 1) === 0) return
    const multi = randInt(0, 5) === 0 ? 2 : 1
    this.scene.pickups.get({
      x: this.x,
      y: this.y,
      value: randInt(10, 30) * this.level * multi,
    })
  }

  getNewTarget(dist = 50) {
    const { x, y } = this.scene.player.sprite
    return { x: x + randInt(-dist, dist), y: y + randInt(-dist, dist) }
  }

  update() {
    super.update()
    if (!this.isAlive()) return
    if (this.bulletTimer > 0) this.bulletTimer--
    if (this.bulletTimer <= 0) {
      this.bulletTimer = 300 + randInt(-100, 100) - this.level * 50
      this.bullets.get(this, this.getNewTarget(), {
        damage: this.strength,
        speed: 5,
      })
    }

    if (!this.target) {
      this.target = this.getNewTarget(200)
      const angle = angleToTarget(this, this.target) - 1.57
      this.ddy = (this.speed / 40) * Math.sin(angle)
      this.ddx = (this.speed / 40) * Math.cos(angle)
      setTimeout(() => {
        this.target = null
      }, randInt(500, 1500))
    }
    this.dx *= 0.98
    this.dy *= 0.98
  }
}
