import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";

import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

const __filename = fileURLToPath(import.meta.url);

let mainWindow;
let modelId;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: fileURLToPath(new URL("./preload.cjs", import.meta.url)),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("load-model", async () => {
  if (modelId) {
    return modelId;
  }

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (progress) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(
          "download-progress",
          progress.percentage
        );
      }
    }
  });

  return modelId;
});

ipcMain.handle("ask-qvac", async (_event, question) => {
  if (!modelId) {
    throw new Error("Model is not loaded.");
  }

  const result = completion({
    modelId,
    history: [
      {
        role: "user",
        content: question
      }
    ],
    stream: true
  });

  let answer = "";

  for await (const token of result.tokenStream) {
    answer += token;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(
        "completion-token",
        token
      );
    }
  }

  return answer;
});

app.on("before-quit", async () => {
  if (modelId) {
    await unloadModel({ modelId });
  }
});