import { ipcMain } from "electron";
import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";

import * as log from 'electron-log';
import * as chalk from 'chalk';
import { autoUpdater } from "electron-updater";

require('./save');

if (process.platform === "win32") process.stdout.isTTY = true; // for windows terminal print color Style

log.info("App Starting...");
log.info(
  `${chalk.cyan(`Platform: ${chalk.bgRedBright(`${process.platform}`)}`)}`
);

function createWindow() {
  log.info(
    `${chalk.cyan(`App version: ${chalk.bgRedBright(`${app.getVersion()}`)}`)}`
  );
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
    minHeight: 600,
    minWidth: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

let loadingScreen: BrowserWindow | null = null;

const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 300, // default 300
      height: 350, // default 350
      // icon: ICON_PATH,
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
  loadingScreen.loadFile(path.join(process.cwd(), "update", "updater.html"))
  loadingScreen.on("closed", (): void => (loadingScreen = null));
  loadingScreen.webContents.on("did-finish-load", () => {
    loadingScreen.show();
    // checkForUpdates();
    autoUpdater.checkForUpdates();
  });
};

app.on("ready", () => {
  // createLoadingScreen();
  createWindow();

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
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("STARTING...");
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
import { eventInit } from './event/getter';
eventInit();