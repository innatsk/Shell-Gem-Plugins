# PRD — Product Requirements Document

## What We Are Building
A portable desktop application called **Shell-Plugin**.

It presents a mobile-inspired icon grid of installed plugins. Clicking a plugin opens a sliding
side panel with dynamically generated controls. The user fills in the controls and clicks Apply —
the input is passed directly to the plugin's DLL. Everything runs offline, from a single folder,
with no installation required.

## Who Is It For
Power users or internal teams who need a unified, clean interface to interact with multiple
independent tools (DLLs) without those tools needing to know about each other.

## Portability Requirement
The app must be **xcopy-deployable**: copy the folder to any Windows machine and run it.
No Node.js, no .NET runtime, no internet connection required on the target machine.

---

## Core Features

### 1. Plugin Grid (Home Screen)
- Scan `<app-root>/plugins/dlls/` on launch and display each DLL as an icon card
- Responsive CSS Grid layout — adapts to window size
- Each card shows: plugin icon, plugin name
- Status dot per card: green (loaded), red (failed to load)

### 2. Side Panel (Plugin Drawer)
- Slides in from the right on plugin icon click
- Header: plugin name + icon + close button
- Body: dynamically rendered controls built from the plugin's parameter schema
- Footer: Apply button + status message area
- Closing resets all state for that plugin

### 3. Dynamic Form Controls
The Shell builds the form entirely from the plugin's JSON schema. Supported types:

| Type | UI Control | Value Passed to DLL |
|------|-----------|---------------------|
| `text` | Text input | String |
| `number` | Number input (min/max enforced) | Number |
| `boolean` | Toggle switch | Boolean |
| `range` | Slider with live value display | Number |
| `file` | Label + Browse button + selected filename | Base64 string of file content |

### 4. File Parameter (Detail)
- Shows a "Browse…" button and a label displaying the selected filename
- On selection, reads the file content and encodes it as a Base64 string
- The Base64 string is what gets passed to the DLL — not the path
- Supports optional `accept` filter (e.g. `".csv,.txt"`) defined in the schema
- File size limit: configurable per-parameter via `maxSizeKb` in schema (default: 10MB)

### 5. Plugin Independence
- Each plugin operates in complete isolation
- Plugin A cannot access data or state belonging to Plugin B
- A DLL crash must not affect the Shell or other plugins (caught in main process)

### 6. Health Check on Activation
- Before rendering the side panel, the Shell pings the plugin via IPC
- Unresponsive → show error with Retry button
- User cancels → close panel, reset state

### 7. Error Handling
- DLL fails to load at startup → log error, show red status dot, skip and continue
- Params fetch fails → show Retry button in panel
- Apply (update) fails → show inline error, do not close panel
- File too large → show inline validation error before sending

---

## What This Project Is NOT
- Not a cloud or networked application — localhost and offline only
- Not a plugin installer or marketplace
- The Shell does not execute DLL code in the renderer — only the main process does
- No user accounts, no persistence of form values between sessions

## Success Criteria
- Launching the app shows all plugins within 2 seconds on a cold start
- Clicking a plugin icon opens its panel within 500ms
- Apply sends data and shows a success confirmation
- Dropping a new DLL in `/plugins/dlls/` and restarting the app shows it in the grid
- The entire app folder can be copied to a new machine and run without any setup
