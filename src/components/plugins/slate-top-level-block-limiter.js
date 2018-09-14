/**
   * Plugin to limit the number of top level blocks
   *
   * @param {Object} options Object with settings
   * @param {Function} overLimitCb The function to be invoked on over limit
   * @param {Function} inLimitCb The function to be invoked on in limit
   * @return {Object} an object with keys that map to the Editor's parameters
*/

function topLevelBlockLimiter (options = {}, overLimitCb, inLimitCb) {
  if (options.limit === undefined) throw new Error('A limit has to be set')
  return {
    onChange (props) {
      var topLevelBlockLength = props.value.document.nodes.size
      if (topLevelBlockLength > options.limit) {
        overLimitCb()
      } else {
        inLimitCb()
      }
    }
  }
}

export default topLevelBlockLimiter
