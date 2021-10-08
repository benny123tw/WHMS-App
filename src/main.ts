import { ipcMain } from "electron";
import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";

import * as log from 'electron-log';
import * as chalk from 'chalk';
import { autoUpdater,  } from "electron-updater";



if (process.platform === "win32") process.stdout.isTTY = true; // for windows terminal print color Style

log.info("App Starting...");
log.info(
  `${chalk.cyan(`Platform: ${chalk.bgRedBright(`${process.platform}`)}`)}`
);

const assetsPath = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join("assets");
const ICON_PATH = path.join(assetsPath, "16x16.png");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: ICON_PATH,
    width: 800,
    minHeight: 750,
    minWidth: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-finish-load", () => {
    /// then close the loading screen window and show the main window
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
  });
}

let loadingScreen: BrowserWindow | null = null;

const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 300, // default 300
      height: 350, // default 350
      icon: ICON_PATH,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, "updater", "updater.js"),
      },
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadFile(path.join(__dirname, "..", "src", "updater", "updater.html"));
  console.log(path.join(__dirname))
  loadingScreen.on("closed", (): void => (loadingScreen = null));
  loadingScreen.webContents.on("did-finish-load", () => {
    loadingScreen.show();
    autoUpdater.checkForUpdates();
  });
};

app.on("ready", () => {

  log.info(
    `${chalk.cyan(`App version: ${chalk.bgRedBright(`${app.getVersion()}`)}`)}`
  );

  createLoadingScreen();
  // createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function sendStatusToWindow(text: string) {
  log.info(`${chalk.greenBright(`${text}`)}`);
  loadingScreen.webContents.send("message", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
  console.log(info)
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("STARTING...");
  console.log(info)
  createWindow();
});
autoUpdater.on("error", (error) => {
  dialog.showErrorBox(
    "Error: ",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});
autoUpdater.on("download-progress", (progressObj) => {
  // progressObj.bytesPerSecond
  // progressObj.percent
  // progressObj.transferred
  // progressObj.total
  sendStatusToWindow(progressObj);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
  autoUpdater.quitAndInstall();
});

/** Event  */
require('./events/whmsEvents');
require('./events/save');