const {getPosts} = require("./render");

module.exports = {
  async load() {
    return getPosts("./")
  }
}
