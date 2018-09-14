import React from 'react'

function topLevelBlockLimiter (options = {}, overLimitCb, inLimitCb) {
  if (options.limit === undefined) throw new Error('A limit has to be set')
  return {
    onChange (props) {
      var topLevelBlockLength = props.value.document.nodes.size
      if (topLevelBlockLength > options.limit) {
        overLimitCb()
      }
      if (topLevelBlockLength <= options.limit) {
        inLimitCb()
      }
    }
  }

  // return {
  //     renderEditor(props){
  //         {console.log(props.value.document.nodes._tail.array.length)}
  //     }
  // }
}

export default topLevelBlockLimiter
