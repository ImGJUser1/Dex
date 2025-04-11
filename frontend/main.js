// frontend/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("build/index.html");
}

const TOOLS_DIR = path.join(__dirname, "../tools");
const PYTHON_PATH = path.join(TOOLS_DIR, "python/python.exe");
const MAVEN_PATH = path.join(TOOLS_DIR, "maven/bin/mvn.cmd");
const GO_PATH = path.join(TOOLS_DIR, "go/bin/go.exe");
const GOVULNCHECK_PATH = path.join(TOOLS_DIR, "go/bin/govulncheck.exe");
const CARGO_PATH = path.join(TOOLS_DIR, "rust/cargo/bin/cargo.exe");
const CARGO_AUDIT_PATH = path.join(TOOLS_DIR, "rust/cargo/bin/cargo-audit.exe");

function checkToolVersion(toolPath, expectedVersion, versionCmd) {
  return new Promise((resolve) => {
    exec(`"${toolPath}" ${versionCmd}`, (error, stdout) => {
      if (error || !stdout.includes(expectedVersion)) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function verifyTools() {
  const checks = [
    { path: PYTHON_PATH, version: "3.10", cmd: "--version" },
    { path: MAVEN_PATH, version: "3.9", cmd: "--version" },
    { path: GO_PATH, version: "1.21", cmd: "version" },
    { path: GOVULNCHECK_PATH, version: "", cmd: "-version" },  // No specific version check
    { path: CARGO_PATH, version: "1.", cmd: "--version" },     // Rust stable
    { path: CARGO_AUDIT_PATH, version: "", cmd: "--version" },
  ];

  for (const tool of checks) {
    if (!fs.existsSync(tool.path) || !(await checkToolVersion(tool.path, tool.version, tool.cmd))) {
      console.error(`${tool.path} missing or outdated`);
      return false;
    }
  }
  return true;
}

app.whenReady().then(async () => {
  if (!(await verifyTools())) {
    console.error("Required tools missing or outdated. Please reinstall Dex.");
    app.quit();
    return;
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("run-dex-scan", (event, projectPath) => {
  const cliPath = path.join(__dirname, "../cli/dex.py");
  const env = {
    ...process.env,
    PATH: `${path.dirname(PYTHON_PATH)};${path.dirname(MAVEN_PATH)};${path.dirname(GO_PATH)};${path.dirname(CARGO_PATH)};${process.env.PATH}`,
  };
  exec(`"${PYTHON_PATH}" "${cliPath}" "${projectPath}"`, { env, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      event.reply("scan-result", { error: stderr });
    } else {
      const scanData = JSON.parse(fs.readFileSync("dex_scan.json", "utf8"));
      event.reply("scan-result", { data: scanData });
    }
  });
});