import React from 'react'
import ReactDOM from 'react-dom'
import chokidar from 'chokidar'
import { dirname, resolve, join } from 'path'
import { existsSync as exists } from 'fs'

import Main from './Main'

/* global settingsPath, widgetPath, components, reload, stylesheet, unstylesheet */

// reload a module
global.reload = require('require-reload')(require)

// load a stylesheet
global.stylesheet = path => {
  unstylesheet(path)
  var styles = document.createElement('link')
  styles.rel = 'stylesheet'
  styles.type = 'text/css'
  styles.href = path
  document.getElementsByTagName('head')[0].appendChild(styles)
}

// unload a stylesheet
global.unstylesheet = path => {
  [].slice.apply(document.querySelectorAll(`link[href="${path}"]`))
    .forEach(el => el.remove())
}

// this will be in some system folder, later
global.settingsPath = resolve(__dirname, '../settings/')
global.widgetPath = join(settingsPath, 'widgets')
global.components = []

// load global CSS
const globalCSS = join(settingsPath, 'global.css')
if (exists(globalCSS)) {
  stylesheet(globalCSS)
}

// get module name from full path
function getMod (path) {
  return path.replace(widgetPath, '').split('/')[1]
}

// TODO: watch css, too

// reload if any file in widgets updates
const watcher = chokidar.watch(`${widgetPath}/**/*`)
watcher.on('all', (event, path) => {
  console.log(event, path)
  process.nextTick(() => {
    ReactDOM.render(<Main components={components} />, document.getElementById('app'))
  })
})

watcher.on('addDir', path => {
  if (dirname(path) === widgetPath) {
    components[getMod(path)] = reload(path).default
  }
})

watcher.on('change', path => {
  const mod = getMod(path)
  components[mod] = reload(`${widgetPath}/${mod}`).default
})
