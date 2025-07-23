import { createContext } from "@shared/context";
import { appRouter } from "@shared/routers/_app";
import * as String from "effect/String";
import { BrowserWindow, app, screen } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import path, { join } from "node:path";
import pkg from "../package.json";

process.env.DOCUMENTS_DIR = join(app.getPath("documents"));

app.setName(String.capitalize(pkg.name));

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("Scribe", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("Scribe");
}

const createWindow = () => {
  const instanceLock = app.requestSingleInstanceLock();

  const { height, width } = screen.getPrimaryDisplay().workArea;
  const mainWindow = new BrowserWindow({
    minWidth: 500,
    minHeight: 500,
    height: height - 20,
    width: width - 20,
    frame: false,
    show: false,
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, "../preload/preload.js"),
    },
  });

  createIPCHandler({
    router: appRouter,
    windows: [mainWindow],
    createContext,
  });

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.show();
  });

  if (import.meta.env.DEV) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  if (!instanceLock) {
    app.quit();
  } else {
    app.on("second-instance", (_, command, __) => {
      _.preventDefault();
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();

        const path = command.pop();

        if (!path) return;

        console.log({ path });
        // TODO: sent path through broadcast channel
        // TODO: test deeplinking
      }
    });
  }

  // fsWatcher({
  //   name: "fs-watcher",
  // })
  //   .on("message", console.log)
  //   .postMessage({
  //     start: true,
  //   });

  // mainWindow.webContents.openDevTools({ mode: "bottom" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
