import { Pool, Sprite as BaseSprite } from 'kontra'

class Sprite extends BaseSprite.class {
  constructor(properties) {
    super(properties)
  }

  damage(n) {
    this.health -= n
    if (this.health <= 0) {
      this.ttl = 0
    }
  }

  update() {
    super.update()
    this.opacity = this.isAlive() ? 1 : 0
  }
}

class Enemy extends Sprite {
  constructor(properties) {
    super(properties)
  }

  update() {
    super.update()

    if (this.target) {
      const x = this.x - this.target.x
      const y = this.y - this.target.y
      const angle = Math.atan2(x, y)
      const dist = Math.sqrt(x * x + y * y)
      const speed = dist < 100 ? 0 : 2
      this.dy = -speed * Math.cos(angle)
      this.dx = -speed * Math.sin(angle)
    }
  }
}
const createEnemy = (...args) => new Enemy(args)

export const Enemies = (scene) => {
  let pool = Pool({ create: createEnemy, maxSize: ENEMY_COUNT })
  let spawnTimer = 0
  return {
    pool,
    get(x, y) {
      const enemy = pool.get({
        x,
        y,
        anchor: { x: 0.5, y: 0.5 },
        width: 30,
        height: 30,
        health: 10,
        target: scene.player.sprite,
        color: 'red',
      })
      enemy.x = x
      enemy.y = y
      if (!scene.children.includes(enemy)) {
        scene.addChild(enemy)
      }
    },
    destroy() {
      pool.clear()
    },
    update() {
      if (spawnTimer > 0) spawnTimer--
      if (spawnTimer === 0) {
        this.get(0, 0)
        spawnTimer = 200
      }
      pool.update()
    },
    render() {
      pool.render()
    },
  }
}

const ENEMY_COUNT = 50
