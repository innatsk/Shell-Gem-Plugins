# Shell-Plugin Project — Claude Instructions

## What Is This Project?
A portable, offline-only modular desktop application built with Electron + Angular.
A single Electron app serves as both the UI shell and the DLL plugin host.
There is no backend service or separate server process.

## Architecture in One Sentence
Angular renders the UI → communicates with Electron Main via IPC → Main loads and calls DLLs natively.

## Two Layers (both inside one Electron app)
- **Renderer Process** → Angular app (UI only, zero DLL knowledge)
- **Main Process** → Node.js (DLL loading via edge-js, IPC handler, file I/O)

## Before Starting Any Task
1. Read `/docs/ARCHITECTURE.md` — layer split, IPC design, folder structure
2. Read `/docs/PRD.md` — features, success criteria, what's out of scope
3. Read `/docs/API_CONTRACT.md` — IPC channel names and message schemas
4. Read `/docs/UI.md` — colors, layout, component behavior
5. Check `/docs/PROGRESS.md` — current status and next steps

## Coding Rules
- Angular components NEVER call `require`, `fs`, or any Node.js API directly
- All DLL calls and file system access go through IPC (`window.electronAPI.*`)
- All IPC handlers live in `main/ipc/` — never inline in `main.js`
- Use Angular services to wrap all `electronAPI` calls (never call from components directly)
- Every IPC call must have a timeout and error path
- No hardcoded absolute paths anywhere — all paths are relative to `app.getAppPath()`
- All plugin icons and DLLs are resolved relative to the `plugins/` folder

## Stack
- UI: Angular (latest stable) + Angular CLI
- Desktop: Electron
- DLL Interop: `edge-js` (called from Electron main process only)
- Styling: SCSS + CSS Grid
- IPC: Electron contextBridge + ipcMain/ipcRenderer

## Portability Rules
- App must work fully offline — no CDN links, no external API calls
- All npm dependencies must be bundled — no runtime `npm install` on target machine
- All paths resolved relative to app root — never hardcoded
- Plugins folder lives at `<app-root>/plugins/` and is always relative

## Update PROGRESS.md
After completing any task, update `/docs/PROGRESS.md` with what was done,
any decisions made, and what the next step is.
