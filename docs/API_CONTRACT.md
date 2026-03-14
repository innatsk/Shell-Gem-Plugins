# API Contract — Angular Renderer ↔ Electron Main (IPC)

## Overview
There is no HTTP server. All communication between the Angular UI and the DLL layer
uses Electron's IPC mechanism via the `contextBridge`.

## How to Call from Angular

Angular services call IPC through `window.electronAPI`, which is exposed by `preload.ts`:

```typescript
// In any Angular service:
const result = await window.electronAPI.invoke('plugins:list');
const params = await window.electronAPI.invoke('plugins:params', { pluginId: 'my-plugin' });
```

**Rule:** Never call `window.electronAPI` from a component. Always use a service.

---

## IPC Channels

### 1. `plugins:list`
Returns all plugins found in `plugins/dlls/` at startup.

**Invoke:** No payload.

**Response (success):**
```json
{
  "success": true,
  "plugins": [
    {
      "id": "volume-controller",
      "name": "Volume Controller",
      "iconPath": "plugins/icons/volume-controller.png",
      "status": "active"
    },
    {
      "id": "network-monitor",
      "name": "Network Monitor",
      "iconPath": "plugins/icons/network-monitor.png",
      "status": "error",
      "error": "Failed to load assembly"
    }
  ]
}
```

**Response (failure):**
```json
{
  "success": false,
  "error": "Could not scan plugins directory"
}
```

---

### 2. `plugins:params`
Returns the UI parameter schema for a specific plugin.

**Invoke payload:**
```json
{ "pluginId": "volume-controller" }
```

**Response (success):**
```json
{
  "success": true,
  "pluginId": "volume-controller",
  "params": [
    {
      "key": "username",
      "type": "text",
      "label": "Username",
      "defaultValue": "admin",
      "required": true,
      "placeholder": "Enter username"
    },
    {
      "key": "volume",
      "type": "range",
      "label": "Volume Level",
      "min": 0,
      "max": 100,
      "step": 1,
      "defaultValue": 50
    },
    {
      "key": "enabled",
      "type": "boolean",
      "label": "Enable Feature",
      "defaultValue": true
    },
    {
      "key": "timeout",
      "type": "number",
      "label": "Timeout (ms)",
      "min": 0,
      "max": 10000,
      "defaultValue": 3000
    },
    {
      "key": "inputFile",
      "type": "file",
      "label": "Input File",
      "accept": ".csv,.txt",
      "maxSizeKb": 5120,
      "required": false
    }
  ]
}
```

**Response (plugin not found / load error):**
```json
{
  "success": false,
  "error": "Plugin volume-controller could not be loaded"
}
```

---

### 3. `plugins:update`
Sends user-submitted parameter values to the plugin DLL.

**Invoke payload:**
```json
{
  "pluginId": "volume-controller",
  "params": {
    "username": "newuser",
    "volume": 75,
    "enabled": false,
    "timeout": 5000,
    "inputFile": "SGVsbG8gV29ybGQ="
  }
}
```

> Note: `file` type parameters are always passed as Base64-encoded strings.
> The DLL receives a plain Base64 string — decoding is the DLL's responsibility.

**Response (success):**
```json
{
  "success": true,
  "pluginId": "volume-controller",
  "message": "Parameters applied successfully"
}
```

**Response (failure):**
```json
{
  "success": false,
  "error": "DLL method threw an exception: index out of range"
}
```

---

## Parameter Schema — Full Type Reference

| Type | Required Fields | Optional Fields | Value sent to DLL |
|------|----------------|-----------------|-------------------|
| `text` | `key`, `type`, `label` | `defaultValue`, `required`, `placeholder` | `string` |
| `number` | `key`, `type`, `label` | `defaultValue`, `min`, `max`, `required` | `number` |
| `boolean` | `key`, `type`, `label` | `defaultValue` | `boolean` |
| `range` | `key`, `type`, `label`, `min`, `max`, `step` | `defaultValue` | `number` |
| `file` | `key`, `type`, `label` | `accept`, `maxSizeKb`, `required` | `string` (Base64) |

---

## preload.ts — contextBridge Definition

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, payload?: unknown) => {
    const allowed = ['plugins:list', 'plugins:params', 'plugins:update'];
    if (!allowed.includes(channel)) throw new Error(`Blocked channel: ${channel}`);
    return ipcRenderer.invoke(channel, payload);
  }
});
```

**Whitelist rule:** Only channels explicitly listed in `allowed` can be called from the renderer.
Any other channel name throws immediately — it never reaches the main process.

---

## File Handling — Where Base64 Encoding Happens

Files are handled **entirely in the renderer** using the browser's native File API.
No IPC or `fs` is needed to read the file:

```typescript
// file.service.ts (Angular)
async readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

The resulting Base64 string is included in the `plugins:update` payload like any other param.
