import { Pool } from 'kontra'
import { Bullets } from './bullets'
import { Sprite } from './sprite'

const SPAWN_TIME = 400

export const Enemies = (scene) => {
  let spawnTimer = 0
  const bullets = Bullets(scene)
  let pool = Pool({
    create: (...args) => new Enemy({ ...args, bullets, scene }),
    maxSize: ENEMY_COUNT,
  })
  const { width, height } = scene.context.canvas
  return {
    pool,
    bullets,
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
        this.get((Math.random() * width) / 2, (Math.random() * height) / 2)
        spawnTimer = SPAWN_TIME
      }
      pool.update()
    },
    render() {
      pool.render()
    },
  }
}

const ENEMY_COUNT = 50

class Enemy extends Sprite {
  constructor(properties) {
    super(properties)
    this.bulletTimer = 0
    this.scene = properties.scene
    this.bullets = properties.bullets
  }

  update() {
    super.update()
    if (!this.isAlive()) return
    if (this.bulletTimer > 0) this.bulletTimer--
    if (this.bulletTimer === 0) {
      this.bulletTimer = 100
      this.bullets.shoot(this, this.scene.player.sprite)
    }

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
