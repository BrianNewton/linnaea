console.log("Preload script loaded");

const { contextBridge, ipcRenderer } = require("electron");

// Safely expose only necessary APIs to the renderer process
contextBridge.exposeInMainWorld("menuAPI", {
    saveAs: (callback) => ipcRenderer.on("saveAs", callback),
    open: (siteData, newImages, saveFile) => ipcRenderer.on("open", siteData, newImages, saveFile),
    save: (callback) => ipcRenderer.on("save", callback),
    new: (callback) => ipcRenderer.on("new", callback),
    unsavedWork: (callback) => ipcRenderer.on("unsavedWork", callback),
});

contextBridge.exposeInMainWorld("api", {
    imageUpload: (images) => ipcRenderer.invoke("imageUpload", images),
    removeImage: (image) => ipcRenderer.invoke("removeImage", image),
    saveAs: (site_data) => ipcRenderer.invoke("saveAs", site_data),
    save: (site_data) => ipcRenderer.invoke("save", site_data),
    unsavedWork: (unsaved) => ipcRenderer.invoke("unsavedWork", unsaved),
});
