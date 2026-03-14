import { ipcMain } from 'electron';
import { scanPlugins } from './pluginScanner';
import { getPluginParams, updatePluginParams } from './pluginLoader';

export function registerIpcHandlers() {
  ipcMain.handle('plugins:list', async () => {
    try {
      const plugins = scanPlugins();
      
      // Try to load params for each to verify they are active
      // In a real scenario we might do this lazily or in parallel
      for (const p of plugins) {
          try {
              // Just pinging it to see if it loads
              await getPluginParams(p.id);
              p.status = 'active';
          } catch (e: any) {
              p.status = 'error';
              p.error = e.message || 'Failed to initialize plugin';
          }
      }

      return {
        success: true,
        plugins
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Could not scan plugins directory'
      };
    }
  });

  ipcMain.handle('plugins:params', async (_event, payload: { pluginId: string }) => {
    try {
      const { pluginId } = payload;
      const params = await getPluginParams(pluginId);
      
      // Parse JSON from C# plugin string result if needed, assuming C# returns object/JSON string
      // Depends on implementation of Mock DLL. If mock dll returns object array, just return.
      const parsedParams = typeof params === 'string' ? JSON.parse(params) : params;

      return {
        success: true,
        pluginId,
        params: parsedParams
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Plugin ${payload?.pluginId} could not be loaded: ${error.message}`
      };
    }
  });

  ipcMain.handle('plugins:update', async (_event, payload: { pluginId: string, params: any }) => {
    try {
      const { pluginId, params } = payload;
      
      // The update calls DLL
      const result = await updatePluginParams(pluginId, params);
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      
      const isSuccess = parsedResult?.success !== false;

      if (!isSuccess) {
          return {
              success: false,
              error: parsedResult?.error || 'DLL reported an error processing parameters'
          };
      }

      return {
        success: true,
        pluginId,
        message: 'Parameters applied successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: `DLL method threw an exception: ${error.message}`
      };
    }
  });
}
