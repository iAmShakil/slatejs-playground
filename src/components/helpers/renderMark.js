import React from 'react'

/**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

const renderMark = props => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underlined':
      return <u {...attributes}>{children}</u>
  }
}

export default renderMark
