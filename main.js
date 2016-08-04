import { app, BrowserWindow } from 'electron'

let mainWindow = null

app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    type: 'desktop'
  })
  //mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.maximize()
  mainWindow.show()
})
