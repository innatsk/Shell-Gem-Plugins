import * as path from 'path';
import { app } from 'electron';
import * as fs from 'fs';

process.env.EDGE_USE_CORECLR = '1';
import * as edge from 'electron-edge-js';

// Dictionary caching Edge.js functions
const _pluginMethods: {
  [pluginId: string]: {
    getParams: (payload: any, callback: (error: any, result: any) => void) => void;
    updateParams: (payload: any, callback: (error: any, result: any) => void) => void;
  }
} = {};

export async function loadPluginMethod(pluginId: string, methodName: string): Promise<any> {
    let dllPath = path.join(app.getAppPath(), '../../plugins', 'dlls', `${pluginId}.dll`);
    if (app.isPackaged) {
        dllPath = path.join(path.dirname(app.getPath('exe')), 'plugins', 'dlls', `${pluginId}.dll`);
    }
    
    if (!fs.existsSync(dllPath)) {
        throw new Error(`DLL for plugin ${pluginId} not found at ${dllPath}`);
    }

    try {
        const method = edge.func({
            assemblyFile: dllPath,
            typeName: `Shell_Gems.Plugins.${pluginId.replace(/-/g, '')}Plugin`, // Convention based on mock
            methodName: methodName
        });
        return method;
    } catch (e: any) {
        throw new Error(`Failed to load method ${methodName} from ${pluginId}.dll: ${e.message}`);
    }
}

export async function getPluginParams(pluginId: string): Promise<any> {
    if (!_pluginMethods[pluginId]) _pluginMethods[pluginId] = { getParams: null as any, updateParams: null as any };
    
    if (!_pluginMethods[pluginId].getParams) {
         _pluginMethods[pluginId].getParams = await loadPluginMethod(pluginId, 'GetParams');
    }

    return new Promise((resolve, reject) => {
        _pluginMethods[pluginId].getParams(null, (error: any, result: any) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

export async function updatePluginParams(pluginId: string, params: any): Promise<any> {
    if (!_pluginMethods[pluginId]) _pluginMethods[pluginId] = { getParams: null as any, updateParams: null as any };

    if (!_pluginMethods[pluginId].updateParams) {
        _pluginMethods[pluginId].updateParams = await loadPluginMethod(pluginId, 'UpdateParams');
    }

    return new Promise((resolve, reject) => {
        _pluginMethods[pluginId].updateParams(params, (error: any, result: any) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
