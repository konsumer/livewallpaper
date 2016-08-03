import React from 'react'

export default class Main extends React.Component {
  render () {
    const components = Object.keys(this.props.components).map(i => {
      return this.props.components[i]
    })
    return (
      <div id='livewallpaper'>
        {components.map((Widget, i) => (<Widget key={i} />))}
      </div>
    )
  }
}
