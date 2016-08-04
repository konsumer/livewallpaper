import React from 'react'
import ReactDOM from 'react-dom'
import chokidar from 'chokidar'
import { dirname, resolve, join } from 'path'
import { existsSync as exists } from 'fs'
import { remote } from 'electron'
import { copySync as copy } from 'fs-extra'

import Main from './Main'

const app = remote.app

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

if (!exists(join(app.getPath('userData'), 'widgets'))) {
  copy(resolve(__dirname, '../setings/widgets'), app.getPath('userData'))
  copy(resolve(__dirname, '../setings/global.css'), app.getPath('userData'))
}

console.log(app.getPath('userData'))

// this will be in some system folder, later
global.settingsPath = app.getPath('userData')
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

// reload if any file in widgets updates
const watcher = chokidar.watch(`${widgetPath}/**/*`, {ignored: /[\/\\]\./})
watcher.on('all', (event, path) => {
  process.nextTick(() => {
    ReactDOM.render(<Main components={components} />, document.getElementById('app'))
  })
})

watcher.on('addDir', path => {
  if (dirname(path) === widgetPath) {
    components[getMod(path)] = reload(path).default
  }
})

function genericChange (path) {
  const mod = getMod(path)
  components[mod] = reload(`${widgetPath}/${mod}`).default
}

watcher.on('unlinkDir', path => {
  if (dirname(path) === widgetPath) {
    delete components[getMod(path)]
  }
})

watcher.on('change', genericChange)
watcher.on('unlink', genericChange)
watcher.on('add', genericChange)
