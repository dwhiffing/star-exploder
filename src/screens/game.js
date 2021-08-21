export const createGame = () => {
  return {
    shutdown() {},
    space: {
      update() {},
      render() {
        text.render()
        text2.render()
        button.render()
      },
    },
  }
}
