import { Pool, Sprite } from 'kontra'

export const Enemies = (scene) => {
  let pool = Pool({ create: Sprite, maxSize: ENEMY_COUNT })
  let spawnTimer = 0
  return {
    pool,
    get(x, y) {
      const enemy = pool.get({
        x,
        y,
        anchor: { x: 0.5, y: 0.5 },
        width: 100,
        height: 100,
        color: 'red',
      })
      enemy.x = x
      enemy.y = y
      // if (!scene.children)
      if (!scene.children.includes(enemy)) {
        scene.addChild(enemy)
        let oldUpdate = enemy.update.bind(enemy)
        enemy.update = () => {
          oldUpdate()
          enemy.opacity = enemy.ttl <= 0 ? 0 : 1
        }
      }

      // const pointer = getPointer()
      // const angle = Math.atan2(400 - pointer.x, 400 - pointer.y)
      // enemy.dy = scene.player.sprite.dy + -4 * Math.cos(angle)
      // enemy.dx = scene.player.sprite.dx + -4 * Math.sin(angle)
    },
    destroy() {
      pool.clear()
    },
    update() {
      if (spawnTimer > 0) spawnTimer--
      if (spawnTimer === 0) {
        this.get(scene.player.sprite.x, scene.player.sprite.y)
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
