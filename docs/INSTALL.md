# Shell-Gems — Installation Guide for Technicians

**Application:** Shell-Gems
**Delivery type:** Portable (no installer — copy and run)
**Target systems:** Windows 10 / Windows 11 (64-bit)
**Internet required:** NO — everything runs fully offline

---

## What Is in This Folder

```
Shell-Gems-Delivery/
├── Shell-Gems/                  ← The application (entire folder)
│   ├── Shell-Gems.exe           ← Launch this to start the app
│   └── plugins/
│       ├── dlls/                ← Plugin files (.dll)
│       └── icons/               ← Plugin icons
├── prerequisites/
│   ├── VC_redist.x64.exe        ← Microsoft Visual C++ (required)
│   └── dotnet-runtime-installer.exe  ← Microsoft .NET Runtime (required)
└── INSTALL.md                   ← This file
```

---

## Step-by-Step Installation

### STEP 1 — Copy the App Folder to the Target Machine

Copy the entire `Shell-Gems/` folder to the desired location on the target machine.

Recommended location:
```
C:\Apps\Shell-Gems\
```

> ⚠️ Do NOT place the folder under `C:\Program Files\` — Windows may block
> the app from writing to that path. Use `C:\Apps\` or the Desktop instead.

---

### STEP 2 — Install Prerequisites

These must be installed ONCE on each machine before the first launch.
They are standard Microsoft packages and are safe to install.

#### 2a — Visual C++ Redistributable

1. Open the `prerequisites\` folder
2. Double-click `VC_redist.x64.exe`
3. If prompted with "Already installed" → click **Close** (no action needed)
4. Otherwise → click **Install** and wait for it to finish
5. Click **Restart later** (do NOT restart yet)

#### 2b — .NET Runtime

1. Still in the `prerequisites\` folder
2. Double-click `dotnet-runtime-installer.exe`
3. Click **Install**
4. Wait for the installation to complete
5. Click **Close**

#### 2c — Restart the Machine

Restart Windows now to ensure both prerequisites are fully active.

---

### STEP 3 — Launch the Application

1. Navigate to the `Shell-Gems\` folder
2. Double-click **Shell-Gems.exe**
3. The application should open and display the plugin grid

> If Windows shows a "Windows protected your PC" SmartScreen warning:
> Click **More info** → then click **Run anyway**
> This is normal for apps that are not signed with a paid certificate.

---

### STEP 4 — Verify Plugins Are Loaded

When the app opens you should see icons for each plugin in the grid.

- **Green dot** on an icon = plugin loaded successfully ✅
- **Red dot** on an icon = plugin failed to load ❌

If you see red dots, see the **Troubleshooting** section below.

---

## Adding or Updating Plugin Files

To add a new plugin or replace an existing one:

1. Close the application if it is running
2. Copy the new `.dll` file into:
   ```
   Shell-Gems\plugins\dlls\
   ```
3. Copy the plugin's icon image (`.png`) into:
   ```
   Shell-Gems\plugins\icons\
   ```
   The icon filename must exactly match the plugin ID (provided by the developer).
4. Launch `Shell-Gems.exe` — the new plugin will appear in the grid

---

## Moving the App to a Different Location

The app is fully portable. To move it:

1. Close the application
2. Copy or move the entire `Shell-Gems\` folder to the new location
3. Launch `Shell-Gems.exe` from the new location

No registry entries, no configuration files outside the folder. Nothing to update.

---

## Uninstalling

1. Close the application
2. Delete the `Shell-Gems\` folder

That is all. There is nothing else to remove — no registry entries, no system files,
no entries in "Add or Remove Programs."

The prerequisites (Visual C++ and .NET) can remain on the machine — they are standard
Microsoft components used by many other applications.

---

## Troubleshooting

### App does not open / crashes immediately
- Make sure both prerequisites in Step 2 were installed successfully
- Make sure the machine has been restarted after installing prerequisites
- Make sure the `Shell-Gems\` folder is NOT inside `C:\Program Files\`
- Try right-clicking `Shell-Gems.exe` → **Run as administrator**

### Plugin shows a red dot
- The `.dll` file may be missing from `plugins\dlls\`
- The `.dll` may be built for a different .NET version than what is installed
- The `.dll` file may be blocked by Windows — right-click the `.dll` file →
  **Properties** → at the bottom check if there is an **Unblock** button → click it

### "Windows protected your PC" warning on launch
- Click **More info** → **Run anyway**
- This is a SmartScreen warning for unsigned executables — it is safe to proceed

### App opens but shows a blank screen
- Wait 10 seconds — the first launch may be slower on some machines
- If still blank, restart the application

### Nothing happens when double-clicking Shell-Gems.exe
- Check that you are running 64-bit Windows (right-click **This PC** → **Properties**)
- This application does not support 32-bit Windows

---

## System Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Windows 10 (64-bit) or Windows 11 |
| RAM | 4 GB |
| Disk space | 500 MB (app + prerequisites) |
| Display | 1280 × 720 or higher |
| Internet | Not required |
| Admin rights | Required for prerequisite installation only |

---

## Support

If you encounter an issue not covered here, contact the application developer
and provide the following information:

- Windows version (Settings → System → About)
- Screenshot of any error message shown
- Which step in this guide the problem occurred at
