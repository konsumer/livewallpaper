# livewallpaper

Cross-platform live desktop wallpaper for everyone, using react.

![screenshot](screen.png)

It's alot like [uebersicht](https://github.com/felixhageloh/uebersicht), but with react & electron.

With it you can make react components for your desktop!

You can control parent-styling (in `settings/global.css`) and make your own widgets (in `settings/widgets`), using the full power of nodejs, react, and electron.

## STILL IN PROGRESS

## making your own widgets

You can put node/es6 modules in `settings/widgets` and they should get added to the screen. I recommend naming the folder your package-name, and adding an index.js (and optionally a package.json) as the entry-point. Your default export should be a react compoonent. Here is a minimal demo:

```js
import React from 'react'

const Hello = (props) => (
  <div className='widget Demo'>
    DEMO
  </div>
)

export default Hello
```
Put this in `settings/widgets/demo/index.js`

You will probably want some style. Make a file named `settings/widgets/demo/style.css`. make your `index.js` look like this:

```js
import React from 'react'

export default class Hello extends React.Component {
  componentDidMount () {
    stylesheet(`${__dirname}/style.css`)
  }

  componentWillUnmount () {
    unstylesheet(`${__dirname}/style.css`)
  }

  render () {
    return (
      <div className='widget Demo'>
        DEMO
      </div>
    )
  }
}
```

For more examples, see `settings/widgets`.


### todo

*  improve live-reloading
*  better reloading of css
*  use notification icon, allow pinning on different desktops, hide in task-manager
*  move settings into more appropriate user-settings folders
*  improve error-handling
*  improve branding (icon, help/about pages, name, etc)
*  start with OS option