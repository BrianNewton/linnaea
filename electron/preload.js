console.log("Preload script loaded");

const { contextBridge, ipcRenderer } = require("electron");

// Safely expose only necessary APIs to the renderer process
contextBridge.exposeInMainWorld("menuAPI", {
    saveAs: (callback) => ipcRenderer.on("saveAs", callback),
    open: (siteData) => ipcRenderer.on("open", siteData),
});

contextBridge.exposeInMainWorld("api", {
    imageUpload: (images) => ipcRenderer.invoke("imageUpload", images),
    removeImage: (image) => ipcRenderer.invoke("removeImage", image),
    saveAs: (site_data) => ipcRenderer.invoke("saveAs", site_data),
});
