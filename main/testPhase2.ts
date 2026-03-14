import { app } from 'electron';
import { scanPlugins } from './ipc/pluginScanner';
import { getPluginParams, updatePluginParams } from './ipc/pluginLoader';

app.whenReady().then(async () => {
    console.log('\n--- START PHASE 2 TEST ---\n');
    
    const plugins = scanPlugins();
    console.log('Scanned plugins:', plugins);
  
    for (const p of plugins) {
        console.log(`Getting params for ${p.id}...`);
        try {
            const params = await getPluginParams(p.id);
            console.log(`Params for ${p.id}:`, JSON.stringify(params, null, 2));
  
            console.log(`Updating params for ${p.id}...`);
            const updateResult = await updatePluginParams(p.id, { username: 'testuser', volume: 80 });
            console.log(`Update result for ${p.id}:`, JSON.stringify(updateResult, null, 2));
        } catch (e: any) {
            console.error(`Error with plugin ${p.id}:`, e);
            process.exit(1);
        }
    }
  
    console.log('\n--- PHASE 2 TEST COMPLETE ---\n');
    process.exit(0);
});
