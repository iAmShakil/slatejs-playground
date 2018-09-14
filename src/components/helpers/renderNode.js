import React from 'react'
import Image from '../Image'

/**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

const renderNode = props => {
  const { attributes, children, node } = props

  switch (node.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'ul_list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list_item':
      return <li {...attributes}>{children}</li>
    case 'ol_list':
      return <ol {...attributes}>{children}</ol>
    case 'image':
      return <Image {...props} />
  }
}

export default renderNode
