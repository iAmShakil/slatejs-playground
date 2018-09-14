import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import DropOrPasteImages from 'slate-drop-or-paste-images'
import EditList from 'slate-edit-list'

import { isKeyHotkey } from 'is-hotkey'

import { Button, Icon, ImgIcon, Toolbar } from './components'
import renderNode from './helpers/renderNode'
import renderMark from './helpers/renderMark'
import BlockLimiter from './plugins/slate-top-level-block-limiter'

import initialValue from './value.json'
import schema from './schema'

/**
 * Defines if the save button is disabled
 *
 * @type {Boolean}
 */
var disableSave = false

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Slate plugins
 *
 * @type {Array}
 */

const plugins = [

  
  DropOrPasteImages({
    extensions: ['png','jpeg'],
    insertImage: (transform, file) => {
      return transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file },
      })
    },
  }),
  
  EditList(),

  BlockLimiter( {limit: 5}, () => {
    disableSave = true
  }, () => {
    disableSave = false
  } )
]

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const existingValue = localStorage.getItem('content')? Value.fromJSON(JSON.parse(localStorage.getItem('content'))) : ''

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichTextExample extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: existingValue || Value.fromJSON(initialValue)
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }

  saveHandler = () => {
    // saving the current state to the local storage
    const value = this.state.value
    const content = JSON.stringify(value.toJSON())
    localStorage.setItem('content', content)
  }
  
  cancelHandler = () => {
    // resetting the current state to the previously stored value
    this.setState({
      value: localStorage.getItem('content')? Value.fromJSON(JSON.parse(localStorage.getItem('content'))) : ''
    })
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <div style={{marginBottom: '10px'}}>
          <button className='top-buttons' disabled={disableSave} onClick={this.saveHandler}>Save</button>
          <button className='top-buttons' onClick={this.cancelHandler}>Cancel</button>
        </div>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('ol_list', 'format_list_numbered')}
          {this.renderBlockButton('ul_list', 'format_list_bulleted')}
          <ImgIcon onImgChange={this.onImgChange} />
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={renderNode}
          renderMark={renderMark}
          schema={schema}
        />
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

    /**
   * Event handler for the image icon
   * @param {Event}
   * @return {Void}
   */
  onImgChange = (event) => {
    event.preventDefault()
    const { value } = this.state
    const file = event.target.files[0]
    if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
      alert('only jpeg and png types are supported')
      return
    }
    const change = this.state.value.change().insertBlock({
      type: 'image',
      isVoid: true,
      data: { file },
    })
    this.onChange(change)
    
    // resetting the file input field
    event.target.value =  ''
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

 renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['ol_list', 'ul_list'].includes(type)) {
      const { value } = this.state
      const parent = value.document.getParent(value.blocks.first().key)
      isActive = this.hasBlock('list_item') && parent && parent.type === type
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
      <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'ul_list' && type != 'ol_list') {

      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list_item')

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('ul_list')
          .unwrapBlock('ol_list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list_item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('ul_list')
          .unwrapBlock('ol_list')
      } else if (isList) {
        change
          .unwrapBlock(
            type == 'ul_list' ? 'ol_list' : 'ul_list'
          )
          .wrapBlock(type)
      } else {
        change.setBlocks('list_item').wrapBlock(type)
      }
    }

    this.onChange(change)
  }
}

/**
 * Export.
 */

export default RichTextExample
