# Architecture

## Why Angular Can't Call DLLs Directly
Angular runs inside Electron's **Renderer process** — a sandboxed Chromium browser context.
Browser sandboxes have no access to the OS, filesystem, or native libraries by design.
DLL calls require Node.js APIs (`require`, native modules) which are only available in the
**Main process**. The solution is IPC: Angular sends a message, Main calls the DLL, returns the result.

## System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        ELECTRON APP (one process tree)               │
│                                                                      │
│  ┌─────────────────────────────┐      ┌───────────────────────────┐  │
│  │     RENDERER PROCESS        │      │       MAIN PROCESS        │  │
│  │     (Angular UI)            │      │       (Node.js)           │  │
│  │                             │ IPC  │                           │  │
│  │  - Plugin grid              │◄────►│  - Scans plugins/dlls/    │  │
│  │  - Side panel               │      │  - Loads DLLs via edge-js │  │
│  │  - Dynamic form controls    │      │  - Handles IPC channels   │  │
│  │  - File browse + Base64     │      │  - File system access     │  │
│  └─────────────────────────────┘      └───────────────────────────┘  │
│                                                                      │
│                    plugins/                                          │
│                    ├── dlls/        ← .dll files live here           │
│                    └── icons/       ← plugin icon images             │
└──────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| UI Framework | Angular (latest stable) | Component architecture, two-way binding for dynamic forms |
| Desktop Shell | Electron | Exposes Node.js APIs to a web UI |
| DLL Interop | `edge-js` | Loads and calls .NET DLLs from Node.js main process |
| IPC Bridge | Electron `contextBridge` + `ipcMain` | Secure renderer↔main communication |
| Styling | SCSS + CSS Grid | Responsive layout, scoped styles per component |
| Bundler | Angular CLI + Electron Builder | Single portable output folder |

## IPC Communication Pattern

```
Angular Component
      │
      ▼
Angular Service (e.g. PluginService)
      │  calls window.electronAPI.invoke('channel:name', payload)
      ▼
preload.ts  (contextBridge exposes electronAPI)
      │
      ▼
main/ipc/<handler>.ts  (ipcMain.handle)
      │
      ▼
edge-js / fs  (native OS operations)
      │
      └──► returns result back up the chain
```

**Rule:** Angular components never call `window.electronAPI` directly.
They always go through an Angular service. This keeps components testable and decoupled.

## Folder Structure

```
shell-plugin/
│
├── CLAUDE.md                            ← Claude instructions (root)
├── docs/                                ← All planning docs
│   ├── PRD.md
│   ├── ARCHITECTURE.md                  ← This file
│   ├── API_CONTRACT.md
│   ├── UI.md
│   └── PROGRESS.md
│
├── package.json                         ← Root: Electron + build deps
├── electron-builder.json                ← Portable build config
│
├── main/                                ← Electron Main process (Node.js)
│   ├── main.ts                          ← App entry point, BrowserWindow setup
│   ├── preload.ts                       ← contextBridge: exposes safe IPC API to renderer
│   └── ipc/
│       ├── pluginScanner.ts             ← Scans plugins/dlls/ on startup
│       ├── pluginLoader.ts              ← Loads DLLs via edge-js
│       └── handlers.ts                  ← Registers all ipcMain.handle channels
│
├── renderer/                            ← Angular app (Renderer process)
│   ├── angular.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts                      ← Angular bootstrap
│       ├── app/
│       │   ├── app.module.ts
│       │   ├── app.component.ts
│       │   ├── services/
│       │   │   ├── plugin.service.ts    ← Wraps all window.electronAPI calls
│       │   │   └── file.service.ts      ← File reading + Base64 encoding
│       │   └── components/
│       │       ├── plugin-grid/         ← Home screen icon grid
│       │       ├── plugin-icon/         ← Single icon card + status dot
│       │       ├── side-panel/          ← Sliding drawer
│       │       ├── dynamic-form/        ← Builds controls from schema
│       │       └── controls/
│       │           ├── text-control/
│       │           ├── number-control/
│       │           ├── boolean-control/
│       │           ├── range-control/
│       │           └── file-control/    ← Browse button + Base64 encoding
│       └── styles/
│           ├── _variables.scss          ← Color tokens, spacing
│           ├── _controls.scss           ← Shared form control styles
│           └── global.scss
│
└── plugins/                             ← Portable plugin assets (ship with app)
    ├── dlls/                            ← Drop .dll files here
    │   └── (your .dll files)
    └── icons/                           ← Plugin icons (filename = plugin ID)
        └── (plugin-id.png)
```

## Portability Design

The app is built as a **self-contained portable package** using Electron Builder:

- Output: a single folder (`dist/win-unpacked/`) that can be zipped and copied anywhere
- No installer required — just run `ShellPlugin.exe`
- All Node modules bundled — no `npm install` needed on target
- No .NET runtime needed — `edge-js` bundles the CLR host
- All paths resolved via `app.getAppPath()` — never hardcoded
- `plugins/` folder is copied into the dist output and resolved at runtime

### Portability Rules for Claude
- Never use `__dirname` alone — always combine with `app.getAppPath()`
- Never reference `node_modules` paths at runtime
- Never use `process.cwd()` for plugin resolution
- The plugins path is always: `path.join(app.getAppPath(), 'plugins')`

## Key Design Decisions

### No Separate Backend Process
All logic that was previously the "Bridge" now lives in Electron's main process.
This eliminates the need to manage a separate server process, port conflicts, or startup ordering.

### contextBridge (not nodeIntegration)
`nodeIntegration: false` is enforced. Angular accesses Node.js only through the
whitelisted `contextBridge` API defined in `preload.ts`. This is the secure Electron pattern.

### edge-js for DLL Interop
`edge-js` is the most reliable way to call .NET DLLs from Node.js without a separate process.
It hosts the CLR inside the Node.js process. Called only from the main process.

### File as Base64
Files selected by the user are read in the renderer via the File API (no fs needed),
encoded to Base64, and passed to the DLL as a string. This keeps file handling
entirely in the renderer and avoids sending file paths across the IPC boundary.

## Port Configuration
No port needed — IPC replaces HTTP. There is no localhost server.
