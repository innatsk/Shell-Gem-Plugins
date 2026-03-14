import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface PluginInfo {
  id: string;
  name: string;
  iconPath: string;
  status: 'active' | 'error' | 'pending';
  error?: string;
}

export function scanPlugins(): PluginInfo[] {
  // app.getAppPath() in dev points to /dist/main because of how we run `electron dist/main/main.js`
  // so we need to step back 2 folders or use process.cwd()
  let pluginsDir = path.join(app.getAppPath(), '../../plugins');
  if (app.isPackaged) {
    pluginsDir = path.join(path.dirname(app.getPath('exe')), 'plugins');
  }
  
  const dllsDir = path.join(pluginsDir, 'dlls');
  const iconsDir = path.join(pluginsDir, 'icons');
  
  const plugins: PluginInfo[] = [];

  try {
    if (!fs.existsSync(dllsDir)) {
      console.warn(`DLL directory not found: ${dllsDir}`);
      return plugins;
    }

    const files = fs.readdirSync(dllsDir);
    const dllFiles = files.filter(f => f.toLowerCase().endsWith('.dll'));

    for (const file of dllFiles) {
      const id = path.parse(file).name;
      // In a real app we might read assembly attributes, but for now we'll derive the name from the ID
      // by replacing dashes and capitalizing words.
      const name = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const iconPathRelative = `plugins/icons/${id}.png`;
      const iconPathAbsolute = path.join(iconsDir, `${id}.png`);
      
      // If icon doesn't exist, we still provide the path but maybe UI handling gracefully deals with broken images
      // Or we can verify it here.
      
      plugins.push({
        id,
        name,
        // UI expects a path relative to the app root, or we can use absolute file:// protocol in UI.
        // It's safer to provide a relative path or a specific protocol we handle. Let's provide relative.
        iconPath: fs.existsSync(iconPathAbsolute) ? iconPathRelative : '',
        status: 'pending' // Actual status will be determined during load/ping
      });
    }
  } catch (error: any) {
    console.error('Error scanning plugins directory:', error);
  }

  return plugins;
}
