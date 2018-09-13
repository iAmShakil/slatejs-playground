import React from 'react'
class Image extends React.Component {
  state = {}
  
  componentDidMount() {
    const { node } = this.props
    const { data } = node
    const file = data.get('file')
    this.load(file)
  }
  
  load(file) {
    const reader = new FileReader()
    reader.addEventListener('load', () => this.setState({ src: reader.result }))
    reader.readAsDataURL(file)
  }

  render() {
    const { attributes } = this.props
    const { src } = this.state
    const { children } = this.props
    const style = this.props.isFocused? styles.blueBorder : styles.noBorder
    return src ? <img style={style} {...attributes}  src={src} />: <span {...attributes}> Loading... {children} </span>
  }
}

const styles = {
  blueBorder: {
    border: '1px solid blue'
  },
  noBorder: {
    border: '0'
  }
}

export default Image