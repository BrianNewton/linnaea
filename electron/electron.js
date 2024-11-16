const path = require("node:path");
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer, dialog, Notification, session } = require("electron");

const fs = require("fs");
const util = require("util");

const reactDevToolsPath =
    "/Users/briannewton/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.0.1_0";

let mainWindow;

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
        icon: path.join(__dirname, "public/Linnaea.png"),
    });

    mainWindow.loadURL(
        // process.env.ELECTRON_START_URL ||
        //     `file://${path.join(__dirname, "../build/index.html")}`
        "http://localhost:3000"
    );

    const isMac = process.platform === "darwin";
    const isSite = 0;

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
                        mainWindow.webContents.send("new");
                    },
                },
                {
                    label: "Open Site",
                    accelerator: "CmdOrCtrl+O", // Optional: Keyboard shortcut
                    click() {
                        dialog
                            .showOpenDialog({
                                title: "Select a site",
                                properties: ["openFile"],
                                filters: [{ name: "Site file", extensions: ["site"] }],
                            })
                            .then(async (result) => {
                                if (!result.canceled) {
                                    // clear temp folder
                                    fs.readdir(path.join(__dirname, "../temp"), (err, files) => {
                                        if (err) throw err;
                                        for (const file of files) {
                                            fs.unlink(path.join(path.join(__dirname, "../temp"), file), (err) => {
                                                if (err) throw err;
                                            });
                                        }
                                    });

                                    // parse new site data
                                    siteData = JSON.parse(await fs.readFile(result.filePaths[0]));

                                    try {
                                        await Promise.all(
                                            Object.keys(siteData["files"]).map(async (fileName) => {
                                                try {
                                                    await fs.copyFile(
                                                        siteData["files"][fileName],
                                                        path.join(__dirname, `../temp/${fileName}`)
                                                    );
                                                } catch (error) {
                                                    console.error(`Error copying ${fileName}`, error);
                                                }
                                            })
                                        );
                                    } catch (error) {
                                        console.error("Error copying files:", error);
                                    }
                                    // open site photos
                                    // Object.keys(siteData["files"]).map(
                                    //     (fileName) => {
                                    //         if (
                                    //             fs.existsSync(
                                    //                 siteData["files"][fileName]
                                    //             )
                                    //         ) {
                                    //             fs.copyFileSync(
                                    //                 siteData["files"][fileName],
                                    //                 path.join(
                                    //                     __dirname,
                                    //                     `../public/temp/${fileName}`
                                    //                 )
                                    //             );
                                    //         } else {
                                    //             dialog.showErrorBox(
                                    //                 "Error",
                                    //                 `${fileName} not found!`
                                    //             );
                                    //         }
                                    //     }
                                    // );

                                    mainWindow.webContents.send("open", siteData);
                                }
                            });
                    },
                },
                {
                    label: "Save",
                    accelerator: "CmdOrCtrl+S", // Optional: Keyboard shortcut
                    click() {
                        mainWindow.webContents.send("saveAs");
                    },
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
                { role: "toggleDevTools" },
                { role: "reload" },
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
        console.log(images);
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

    ipcMain.handle("saveAs", async (event, site_data) => {
        const siteDataString = JSON.stringify(site_data);
        dialog
            .showSaveDialog({
                title: "Save your site data",
                filters: [{ name: "Site name", extensions: ["site"] }],
            })
            .then((file) => {
                if (!file.canceled) {
                    fs.writeFile(file.filePath.toString(), siteDataString, (err) => {
                        if (err) {
                            dialog.showErrorBox("Error", "Error saving file");
                        } else {
                            dialog.showMessageBox({
                                message: "Site saved successfully!",
                            });
                        }
                    });
                }
            });
    });
}

app.whenReady().then(async () => {
    await session.defaultSession.loadExtension(reactDevToolsPath);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
