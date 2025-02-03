import { createContext } from "@shared/context";
import { appRouter } from "@shared/routers/_app";
import { app, BrowserWindow, screen } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { join } from "node:path";
import pkg from "../package.json";
import * as String from "effect/String";

app.setName(String.capitalize(pkg.name));

const createWindow = () => {
  const { height, width } = screen.getPrimaryDisplay().workArea;
  const mainWindow = new BrowserWindow({
    minWidth: 500,
    minHeight: 500,
    height: height - 100,
    width: width - 100,
    frame:false,
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
    mainWindow.show;
  });

  if (import.meta.env.DEV) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // mainWindow.webContents.openDevTools({ mode: "bottom" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
