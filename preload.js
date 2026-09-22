import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("qvac", {
  loadModel: () => ipcRenderer.invoke("load-model"),

  ask: (question) =>
    ipcRenderer.invoke("ask-qvac", question),

  onProgress: (callback) => {
    ipcRenderer.on("download-progress", (_event, progress) => {
      callback(progress);
    });
  },

  onToken: (callback) => {
    ipcRenderer.on("completion-token", (_event, token) => {
      callback(token);
    });
  }
});