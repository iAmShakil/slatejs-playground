import React, { Component } from 'react'
import Editor from './Editor'

class SlateEditor extends Component {
    render () {
        return (
            <div className="main-editor">
              <Editor />  
            </div>
        )
    }
}

export default SlateEditor