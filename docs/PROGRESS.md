# Progress Tracker

## Current Status
✅ **Project Complete**. The Shell-Plugin application is fully built, tested, packaged, and ready for deployment.

---

## Completed
- [x] Project design and architecture defined
- [x] `CLAUDE.md` created
- [x] `docs/PRD.md` created
- [x] `docs/ARCHITECTURE.md` created
- [x] `docs/API_CONTRACT.md` created
- [x] `docs/UI.md` created
- [x] `docs/PROGRESS.md` created
- [x] `docs/DEPLOYMENT.md` created
- [x] `docs/README-TECHNICIAN.txt` created

---

## Up Next (Suggested Build Order)

### Phase 1 — Project Scaffolding
Set up the Electron + Angular structure before writing any feature code.

- [x] Initialize root `package.json` with Electron + Electron Builder deps
- [x] Scaffold Angular app in `/renderer` using Angular CLI (`ng new`)
- [x] Configure Angular to output into `renderer/dist/` (used by Electron)
- [x] Create `main/main.ts` — Electron entry point, loads Angular output
- [x] Create `main/preload.ts` — `contextBridge` exposing `electronAPI.invoke`
- [x] Verify Electron opens Angular app in a BrowserWindow
- [x] Configure `scripts/build.js` via `electron-packager` for portable build (no installer)
- [x] Confirm `plugins/` folder copies into build output

### Phase 2 — Main Process IPC Layer
Build the DLL loading and IPC handler layer before touching the UI.

- [x] Create `main/ipc/pluginScanner.ts` — scans `plugins/dlls/` on startup
- [x] Create `main/ipc/pluginLoader.ts` — loads each DLL via `edge-js`
- [x] Create `main/ipc/handlers.ts` — registers all `ipcMain.handle` channels:
  - [x] `plugins:list`
  - [x] `plugins:params`
  - [x] `plugins:update`
- [x] Test all 3 channels with a mock/dummy DLL before building UI

### Phase 3 — Angular UI
Build UI components only after IPC layer is confirmed working.

- [x] Create `plugin.service.ts` — wraps all `window.electronAPI.invoke` calls
- [x] Create `file.service.ts` — File API + Base64 encoding
- [x] Build `plugin-grid` component — calls `plugins:list`, renders icon cards
- [x] Build `plugin-icon` component — card + status dot
- [x] Build `side-panel` component — animated drawer, overlay
- [x] Build `dynamic-form` component — renders controls from schema
- [x] Build `text-control` component
- [x] Build `number-control` component (with min/max validation)
- [x] Build `boolean-control` component (toggle switch)
- [x] Build `range-control` component (slider + live value)
- [x] Build `file-control` component (Browse + Base64 + size validation)
- [x] Wire Apply button → `plugins:update` IPC call
- [x] Add all error states (unresponsive, load failure, update failure, file too large)
- [x] Apply SCSS styles from `UI.md`

### Phase 4 — Integration & Polish
- [x] End-to-end test with a real .dll plugin
- [x] Handle "Bridge not running" equivalent: main process fails to init → show error screen
- [x] Add skeleton loading animations
- [x] Add tooltip on red-dot icon cards showing load error message
- [x] Final portable build test: copy `dist/win-unpacked/` to clean machine and verify

### Phase 5 — Delivery Package Assembly
Follow `docs/DELIVERY_PACKAGE.md` exactly for this phase.

- [x] Run `npm run build:portable` → confirm `dist/win-unpacked/` output
- [x] Download `VC_redist.x64.exe` from https://aka.ms/vs/17/release/vc_redist.x64.exe on dev machine
- [x] Download `dotnet-runtime-installer.exe` (.NET 6.0 x64) from https://dotnet.microsoft.com/en-us/download/dotnet/6.0 — confirm version matches DLL plugins
- [x] Assemble `Shell-Gems-Delivery/` folder structure as defined in DELIVERY_PACKAGE.md
- [x] Place all plugin `.dll` files in `Shell-Gems/plugins/dlls/`
- [x] Place all plugin icon `.png` files in `Shell-Gems/plugins/icons/`
- [x] Confirm `INSTALL.md` is in root of delivery folder
- [x] Smoke test the entire delivery folder on dev machine
- [x] Test on clean Windows 10 VM — no dev tools, no internet
- [x] Test on clean Windows 11 VM — no dev tools, no internet
- [x] Verify app works when folder path contains spaces
- [x] Verify app works after moving delivery folder to a different drive
- [x] Zip `Shell-Gems-Delivery/` and deliver

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| (start) | Use Angular instead of React | Requested by design spec |
| (start) | No separate backend process | All DLL logic moves to Electron main process |
| (start) | IPC replaces HTTP/REST | No localhost server needed, cleaner architecture |
| (start) | `contextBridge` with whitelist | Secure Electron pattern, `nodeIntegration: false` |
| (start) | File passed as Base64 string | Keeps file handling in renderer (File API), no fs over IPC |
| (start) | Portable build (no installer) | Offline + xcopy-deployable requirement |
| (start) | `edge-js` for DLL interop | Hosts CLR inside Node.js, no separate .NET process |
| (start) | Target Windows 10 + 11, clean machines | Widest compatibility, assume nothing pre-installed |
| (start) | Bundle VC++ Redist + .NET 6 Runtime in delivery folder | edge-js requires both on clean machines |
| (start) | Automate delivery build via batch script | Repeatable, no manual steps, less human error |

---

## Known Issues / Blockers
_None yet — update this section as you work._
