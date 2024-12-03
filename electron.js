const path = require("node:path");
const { app, BrowserWindow, Menu, ipcMain, dialog, session } = require("electron");

const fs = require("fs");
const { type } = require("node:os");

const reactDevToolsPath =
    "/Users/briannewton/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.0.1_0";

let mainWindow;
let hasUnsavedWork = false;
let savedState = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 730,
        minHeight: 730,
        minWidth: 1100,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Ensure this path is correct
            contextIsolation: true, // Must be true for contextBridge to work
            enableRemoteModule: false, // For security, remote should be disabled
            nodeIntegration: false, // Must be false when using contextBridge
        },
    });

    mainWindow.setTitle("New site");

    mainWindow.loadURL(
        process.env.ISDEV === "true"
            ? "http://localhost:3000"
            : process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "/build/index.html")}`
    );

    const isMac = process.platform === "darwin";
    let isSite = false;
    let saveFile = ""; // Site save file, when null 'save' option is disabled

    const menuTemplate = [
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: "about" },
                          { type: "separator" },
                          { role: "services" },
                          { type: "separator" },
                          { role: "hide" },
                          { role: "hideOthers" },
                          { role: "unhide" },
                          { type: "separator" },
                          { role: "quit" },
                      ],
                  },
              ]
            : []),
        {
            label: "File",
            submenu: [
                {
                    label: "New Site",
                    accelerator: "CmdOrCtrl+N",
                    click() {
                        if (hasUnsavedWork) {
                            const response = dialog.showMessageBoxSync({
                                message: "All progress will be lost. Are you sure?",
                                buttons: ["Confirm", "Cancel"],
                                defaultId: 1,
                            });
                            if (response === 0) {
                                mainWindow.webContents.send("new");
                                mainWindow.setTitle("New site");
                                saveFile = null;
                                disableSave();
                            }
                        } else {
                            mainWindow.webContents.send("new");
                            mainWindow.setTitle("New site");
                            saveFile = null;
                            disableSave();
                        }
                    },
                },
                {
                    label: "Open Site",
                    accelerator: "CmdOrCtrl+O", // Optional: Keyboard shortcut
                    click() {
                        let response = 0;
                        if (hasUnsavedWork) {
                            response = dialog.showMessageBoxSync({
                                message: "All progress will be lost. Are you sure?",
                                buttons: ["Confirm", "Cancel"],
                                defaultId: 1,
                            });
                        }
                        if (response === 0) {
                            dialog
                                .showOpenDialog({
                                    title: "Select a site",
                                    properties: ["openFile"],
                                    filters: [{ name: "Site file", extensions: ["site"] }],
                                })
                                .then(async (result) => {
                                    if (!result.canceled) {
                                        // parse new site data
                                        siteData = JSON.parse(fs.readFileSync(result.filePaths[0]));
                                        newImages = {};
                                        let canceled = 0;
                                        try {
                                            // need to check if photos exist and have re-upload if they don't
                                            Object.keys(siteData["files"]).map(async (fileName) => {
                                                if (!fs.existsSync(siteData["files"][fileName])) {
                                                    // If photo is not found
                                                    const response = dialog.showMessageBoxSync({
                                                        message: `${fileName} not found!`,
                                                        buttons: ["Choose image", "Delete image", "Cancel"],
                                                        defaultId: 0,
                                                    });
                                                    if (response === 0) {
                                                        // Re-upload photo
                                                        const result = dialog.showOpenDialogSync({
                                                            properties: ["openFile"],
                                                            filters: [{ name: "Images", extensions: ["jpg", "png", "jpeg", "bmp"] }],
                                                        });

                                                        newImages[result[0].replace(/^.*[\\/]/, "")] = {};
                                                        newImages[result[0].replace(/^.*[\\/]/, "")]["path"] = result[0];
                                                        base64Image = fs.readFileSync(result[0], { encoding: "base64" });
                                                        newImages[result[0].replace(/^.*[\\/]/, "")][
                                                            "data"
                                                        ] = `data:image/png;base64,${base64Image}`;

                                                        siteData["files"][result[0].replace(/^.*[\\/]/, "")] = result[0];
                                                        siteData["site"][result[0].replace(/^.*[\\/]/, "")] = siteData["site"][fileName];

                                                        delete siteData["files"][fileName];
                                                        delete siteData["site"][fileName];
                                                    } else if (response === 1) {
                                                        // Delete photo
                                                        delete siteData["files"][fileName];
                                                        delete siteData["site"][fileName];
                                                    } else if (response === 2) {
                                                        // Cancel open
                                                        canceled = 1;
                                                    }
                                                } else if (canceled === 0) {
                                                    // open opened site photos
                                                    newImages[fileName] = {};
                                                    newImages[fileName]["path"] = siteData["files"][fileName];
                                                    base64Image = fs.readFileSync(siteData["files"][fileName], { encoding: "base64" });
                                                    newImages[fileName]["data"] = `data:image/png;base64,${base64Image}`;
                                                }
                                            });
                                        } catch (error) {
                                            console.error("Error copying files:", error);
                                        }
                                        if (canceled === 0) {
                                            // pass opened site info and new photoos to react renderer process
                                            saveFile = result.filePaths[0];

                                            // enable save option in menu
                                            const menu = Menu.getApplicationMenu();
                                            const saveMenuItem = menu.getMenuItemById("save"); // Access by ID
                                            if (saveMenuItem) {
                                                saveMenuItem.enabled = true; // Update based on variable
                                            }
                                            mainWindow.setTitle(result.filePaths[0].replace(/^.*[\\/]/, "").replace(/\.site$/, ""));
                                            mainWindow.webContents.send("open", siteData, newImages, result.filePaths[0]);
                                        }
                                    }
                                });
                        }
                    },
                },
                {
                    label: "Save",
                    id: "save",
                    accelerator: "CmdOrCtrl+S", // Optional: Keyboard shortcut
                    click() {
                        mainWindow.webContents.send("save");
                    },
                    enabled: isSite,
                },
                {
                    label: "Save As",
                    accelerator: "Shift+CmdOrCtrl+S",
                    click() {
                        mainWindow.webContents.send("saveAs");
                    },
                },
                { type: "separator" }, // Optional: Add a separator between options
                {
                    label: "Export raw data",
                    click() {
                        mainWindow.webContents.send("exportData");
                    },
                },
                { type: "separator" },
                {
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click() {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: "Window",
            submenu: [
                { role: "minimize" },
                { role: "togglefullscreen" },
                ...(process.env.ISDEV === "true" ? [{ role: "toggleDevTools" }, { role: "reload" }] : []),
                ...(isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }]),
            ],
        },
    ];

    // Create the menu from the template
    const menu = Menu.buildFromTemplate(menuTemplate);

    // Set the menu as the application menu
    Menu.setApplicationMenu(menu);

    mainWindow.on("resize", () => {
        let [width, height] = mainWindow.getSize();

        const minWidth = Math.round((height - 178) / 0.75 + 330);

        if (width < minWidth) {
            mainWindow.setSize(minWidth, height);
            // mainWindow.minWidth = minWidth;
        }
    });

    mainWindow.on("closed", () => (mainWindow = null));

    // Handles new image uploads by creating a temporary copy under public/temp
    ipcMain.handle("imageUpload", async (event, images) => {
        //open file dialog
        const result = await dialog.showOpenDialog({
            properties: ["openFile", "multiSelections"],
            filters: [{ name: "Images", extensions: ["jpg", "png", "jpeg", "bmp"] }],
        });
        // For each selected file, create object entry {filename: filepath}
        const newImages = {};
        for (let i = 0; i < result.filePaths.length; i++) {
            if (!images.includes(result.filePaths[i].replace(/^.*[\\/]/, ""))) {
                newImages[result.filePaths[i].replace(/^.*[\\/]/, "")] = {};
                newImages[result.filePaths[i].replace(/^.*[\\/]/, "")]["path"] = result.filePaths[i];
                base64Image = fs.readFileSync(result.filePaths[i], { encoding: "base64" });
                newImages[result.filePaths[i].replace(/^.*[\\/]/, "")]["data"] = `data:image/png;base64,${base64Image}`;
            } else {
                //If file is already uploaded skip and show an error
                dialog.showMessageBox({ message: `${result.filePaths[i].replace(/^.*[\\/]/, "")} already uploaded!` });
            }
        }
        return newImages;
    });

    // Handels saving a new site file
    ipcMain.handle("saveAs", async (event, site_data) => {
        const siteDataString = JSON.stringify(site_data); // convert site data to JSON for easy storage
        const file = dialog.showSaveDialogSync({
            // get save file
            title: "Save your site data",
            filters: [{ name: "Site name", extensions: ["site"] }],
        });

        // write site data to JSON file
        if (file) {
            fs.writeFile(file, siteDataString, (err) => {
                if (err) {
                    dialog.showErrorBox("Error", "Error saving file");
                } else {
                    dialog.showMessageBox({
                        message: "Site saved successfully!",
                    });
                }
            });

            // set savefile
            saveFile = file;

            // enable save option in menu
            const menu = Menu.getApplicationMenu();
            const saveMenuItem = menu.getMenuItemById("save"); // Access by ID
            if (saveMenuItem) {
                saveMenuItem.enabled = true; // Update based on variable
            }
            mainWindow.setTitle(saveFile.replace(/^.*[\\/]/, "").replace(/\.site$/, ""));
            //return savefile to renderer process
            return file;
        } else {
            // if cancleed, no save file for you
            return 0;
        }
    });

    // Handels saving a new site file
    ipcMain.handle("save", async (event, site_data) => {
        const siteDataString = JSON.stringify(site_data); // convert site data to JSON for easy storage

        // write site data to JSON file
        if (saveFile) {
            fs.writeFile(saveFile, siteDataString, (err) => {
                if (err) {
                    dialog.showErrorBox("Error", "Error saving file");
                } else {
                    dialog.showMessageBox({
                        message: "Site saved successfully!",
                    });
                }
            });
            mainWindow.setTitle(saveFile.replace(/^.*[\\/]/, "").replace(/\.site$/, ""));
        }
    });

    // Checks to see if there's unsaved work, renames window and prevents quitting without saving
    ipcMain.handle("unsavedWork", async (event, unsavedWork) => {
        hasUnsavedWork = unsavedWork;
        if (hasUnsavedWork) {
            if (saveFile) {
                mainWindow.setTitle(`${saveFile.replace(/^.*[\\/]/, "").replace(/\.site$/, "")} *`);
            } else {
                mainWindow.setTitle("New site *");
            }
        }
    });

    // receives state information when the window is closed
    ipcMain.handle("sendState", async (event, currentState) => {
        savedState = currentState;
    });

    // Export data
    ipcMain.handle("sendExportData", async (event, csvData) => {
        const file = dialog.showSaveDialogSync({
            // get save file
            title: "Save your site data",
            filters: [{ name: "Report name", extensions: ["csv"] }],
        });

        if (file) {
            const csvString = csvData.map((row) => row.join(",")).join("\n");
            fs.writeFile(file, csvString, (err) => {
                if (err) {
                    dialog.showErrorBox("Error", "Error saving file");
                } else {
                    dialog.showMessageBox({
                        message: "Data exported successfully!",
                    });
                }
            });
        } else {
            // if cancleed, no save file for you
            return 0;
        }
    });
}

function disableSave() {
    const menu = Menu.getApplicationMenu();
    const saveMenuItem = menu.getMenuItemById("save"); // Access by ID
    if (saveMenuItem) {
        saveMenuItem.enabled = false; // Update based on variable
    }
}

app.whenReady().then(async () => {
    await session.defaultSession.loadExtension(reactDevToolsPath);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    ipcMain.removeHandler("imageUpload");
    ipcMain.removeHandler("saveAs");
    ipcMain.removeHandler("save");
    ipcMain.removeHandler("unsavedWork");
    ipcMain.removeHandler("sendState");
    ipcMain.removeHandler("sendExportData");

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }

    // restore saved state if there is one
    if (savedState) {
        if (savedState["saveFile"]) {
            if (hasUnsavedWork) {
                mainWindow.setTitle(`${savedState["saveFile"].replace(/^.*[\\/]/, "").replace(/\.site$/, "")} *`);
            } else {
                mainWindow.setTitle(savedState["saveFile"].replace(/^.*[\\/]/, "").replace(/\.site$/, ""));
            }
        } else {
            if (hasUnsavedWork) {
                mainWindow.setTitle("New site *");
            } else {
                mainWindow.setTitle("New site");
            }
        }
        mainWindow.webContents.once("did-finish-load", () => {
            mainWindow.webContents.send("restoreState", savedState);
        });
    }
});

// prevents quitting immediately if there's unsaved work
app.on("before-quit", (event) => {
    if (hasUnsavedWork) {
        const choice = dialog.showMessageBoxSync({
            type: "question",
            buttons: ["Cancel", "Quit"],
            defaultId: 0,
            message: "You have unsaved work. Are you sure you want to quit?",
        });

        if (choice === 0) {
            event.preventDefault(); // Prevent quitting
        }
    }
});
