import { createContext } from "@shared/context";
import { appRouter } from "@shared/routers/_app";
import * as String from "effect/String";
import { BrowserWindow, app, screen } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { join } from "node:path";
import pkg from "../package.json";

process.env.DOCUMENTS_DIR = join(app.getPath("documents"));

app.setName(String.capitalize(pkg.name));

const createWindow = () => {
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
