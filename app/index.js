"use strict";
const electron = require("electron");
const { menubar } = require("menubar");

var mb = menubar({
  dir: __dirname,
  tooltip: "Pomogatchi",
  icon: __dirname + "/img/pomodoro.png",
  browserWindow: {
    width: 420,
    height: 420,
    skipTaskbar: true,
    alwaysOnTop: false,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: false,
    focusable: false,
    roundedCorners: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

const contextMenu = electron.Menu.buildFromTemplate([
  {
    label: "About",
    click() {
      electron.dialog.showMessageBox({
        title: "Pomogatchi",
        type: "info",
        message:
          "A desktop pomodoro plant that thrives on your productivity.",
        buttons: ["Close"],
      });
    },
  },
  {
    type: "separator",
  },
  {
    label: "Quit",
    click() {
      mb.app.quit();
    },
  },
]);

mb.on("ready", () => {
  global.sharedObj = {
    hide: mb.hideWindow,
    quit: mb.app.quit,
    pinned: false,
  };

  console.log("Pomogatchi is planted in your menubar.");

  if (process.platform == "win32") {
    mb.tray.setContextMenu(contextMenu);
  } else {
    mb.tray.on("right-click", () => {
      mb.tray.popUpContextMenu(contextMenu);
    });
  }
});

mb.on("after-create-window", function () {
  //mb.window.openDevTools()
});
