#!/usr/bin/env node
"use strict";

const { spawn, exec } = require("node:child_process");
const { existsSync } = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const PORT = process.env.PORT || "43123";
const HOST = "127.0.0.1";
const url = `http://${HOST}:${PORT}`;
const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";
const npxCmd = isWin ? "npx.cmd" : "npx";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: false,
      windowsHide: false,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function waitForServer() {
  return new Promise((resolve) => {
    let attempts = 0;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        attempts += 1;
        if (attempts > 80) resolve();
        else setTimeout(tick, 400);
      });
    };
    tick();
  });
}

function openBrowser() {
  const command = isWin
    ? `cmd /c start "" "${url}"`
    : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(command, { cwd: root });
}

async function main() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) {
    console.error("Need Node.js 20+: https://nodejs.org");
    process.exit(1);
  }

  if (!existsSync(path.join(root, "node_modules", "next"))) {
    console.log("npm install...");
    await run(npmCmd, ["install"]);
  }

  console.log(`MBA-parts: ${url}`);
  const child = spawn(
    npxCmd,
    ["--yes", "next", "dev", "--hostname", HOST, "--port", PORT],
    {
      cwd: root,
      stdio: "inherit",
      shell: false,
      windowsHide: false,
    },
  );

  waitForServer().then(openBrowser);

  const watcher = spawn(process.execPath, [path.join(__dirname, "watch-inbox.cjs")], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      MBA_SITE: url,
      MBA_SUPPLIER_KEY: process.env.SUPPLIER_API_KEY || "mba-parts-local",
    },
  });

  const stopWatcher = () => {
    try {
      watcher.kill();
    } catch {
      // already stopped
    }
  };

  child.on("error", (error) => {
    console.error(error);
    stopWatcher();
    process.exit(1);
  });
  child.on("exit", (code) => {
    stopWatcher();
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
