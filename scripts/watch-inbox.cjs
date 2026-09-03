#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const root = path.resolve(__dirname, "..");
const inbox = path.join(root, "data", "inbox");
const doneDir = path.join(inbox, "done");
const errorDir = path.join(inbox, "error");
const site = process.env.MBA_SITE || "http://127.0.0.1:43123";
const key = process.env.MBA_SUPPLIER_KEY || process.env.SUPPLIER_API_KEY || "mba-parts-local";
const INTERVAL_MS = Number(process.env.MBA_INBOX_INTERVAL_MS || 8000);

const SKIP = new Set([".gitkeep", "как-работает.txt"]);
const sizes = new Map();

function isPriceFile(name) {
  const lower = name.toLowerCase();
  if (SKIP.has(lower) || name.startsWith(".")) return false;
  return /\.(csv|txt|xlsx|xls)$/.test(lower);
}

function postFile(filePath, filename) {
  return new Promise((resolve, reject) => {
    const url = new URL("/api/supplier/ostatki?mode=replace", site);
    const body = fs.readFileSync(filePath);
    const boundary = `----mba${Date.now()}`;
    const head = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
    );
    const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
    const payload = Buffer.concat([head, body, tail]);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": payload.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(text);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${text}`));
          }
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function ensureDirs() {
  await fsp.mkdir(inbox, { recursive: true });
  await fsp.mkdir(doneDir, { recursive: true });
  await fsp.mkdir(errorDir, { recursive: true });
}

async function tick() {
  await ensureDirs();
  const names = await fsp.readdir(inbox);
  for (const name of names) {
    if (!isPriceFile(name)) continue;
    const filePath = path.join(inbox, name);
    const stat = await fsp.stat(filePath).catch(() => null);
    if (!stat || !stat.isFile()) continue;
    const prev = sizes.get(name);
    if (!prev || prev.size !== stat.size) {
      sizes.set(name, { size: stat.size, seen: Date.now() });
      continue;
    }
    if (Date.now() - prev.seen < 2500) continue;

    sizes.delete(name);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    try {
      const text = await postFile(filePath, name);
      const dest = path.join(doneDir, `${stamp}-${name}`);
      await fsp.rename(filePath, dest);
      console.log(`[inbox] загружен ${name} → каталог обновлён. ${text}`);
    } catch (error) {
      const dest = path.join(errorDir, `${stamp}-${name}`);
      await fsp.rename(filePath, dest).catch(() => {});
      console.error(`[inbox] ошибка ${name}:`, error.message || error);
    }
  }
}

ensureDirs()
  .then(() => {
    console.log(`MBA-parts inbox: ${inbox}`);
    console.log("Положите CSV/Excel сюда — сайт подхватит сам.");
    setInterval(() => {
      tick().catch((error) => console.error("[inbox]", error));
    }, INTERVAL_MS);
    tick().catch(() => {});
  })
  .catch((error) => {
    console.error("[inbox]", error);
    process.exit(1);
  });
