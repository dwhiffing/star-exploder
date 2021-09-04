import { Sprite, Pool, pointerPressed, getPointer } from 'kontra'

export const Bullets = (scene) => {
  let pool = Pool({ create: Sprite, maxSize: BULLET_COUNT })
  let bulletTimer = 0
  return {
    pool,
    get(x, y) {
      const bullet = pool.get({
        x,
        y,
        anchor: { x: 0.5, y: 0.5 },
        width: 10,
        height: 10,
        color: 'purple',
      })
      bullet.x = x
      bullet.y = y
      // if (!scene.children)
      if (!scene.children.includes(bullet)) {
        scene.addChild(bullet)
        let oldUpdate = bullet.update.bind(bullet)
        bullet.update = () => {
          oldUpdate()
          if (bullet.ttl <= 0) {
            bullet.opacity = 0
          }
        }
      }

      const pointer = getPointer()
      const angle = Math.atan2(400 - pointer.x, 400 - pointer.y)
      bullet.dy = scene.player.sprite.dy + -8 * Math.cos(angle)
      bullet.dx = scene.player.sprite.dx + -8 * Math.sin(angle)
      bullet.ttl = 200
    },
    destroy() {
      pool.clear()
    },
    update() {
      if (bulletTimer > 0) bulletTimer--
      if (pointerPressed('left') && bulletTimer === 0) {
        this.get(scene.player.sprite.x, scene.player.sprite.y)
        bulletTimer = 10
      }
      pool.update()
    },
    render() {
      pool.render()
    },
  }
}

const BULLET_COUNT = 200
