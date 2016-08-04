import { app, BrowserWindow, Menu, Tray, screen } from 'electron'

app.dock.hide()
app.on('window-all-closed', () => app.quit())

let mainWindow = null
let tray = null
app.on('ready', () => {
  // multi-monitor support: https://github.com/electron/electron/pull/1016
  // console.log('screens', screen.getAllDisplays())

  tray = new Tray('icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Reload', click () { mainWindow.reload() }}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    // type: 'desktop',
    skipTaskbar: true
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = null
    tray = null
  })
  mainWindow.maximize()
  mainWindow.show()
})
