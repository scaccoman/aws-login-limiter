'use strict'

module.exports = {
  // to test stringed sls local output
  getErrorJson: string => {
    const found = string.match(/Error:(\.\d)*/)
    let r = string.substr(found.index + 7)
    r = r.substr(0, r.lastIndexOf('}') + 1)
    return JSON.parse(r)
  }
}
