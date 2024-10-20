const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 990,
        height: 680,
        minHeight: 680,
        minWidth: 990,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadURL(
        // process.env.ELECTRON_START_URL ||
        //     `file://${path.join(__dirname, "../build/index.html")}`
        "http://localhost:3000"
    );

    mainWindow.on("resize", () => {
        let [width, height] = mainWindow.getSize();

        const minWidth = Math.round((height - 178) / 0.75 + 330);

        if (width < minWidth) {
            mainWindow.setSize(minWidth, height);
        }
    });

    mainWindow.on("closed", () => (mainWindow = null));
}

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
