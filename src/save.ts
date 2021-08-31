import { ipcMain, dialog } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { ConfigSchema } from './type/ConfigSchema';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

ipcMain.on('save-dialog', async (event, data) => {
    const file = await dialog.showSaveDialog({
        title: "Select File",
        
    })
});

ipcMain.on('save-to-config', async (event, data: ConfigSchema) => {
    writeFileSync( CONFIG_PATH , JSON.stringify(data, null, 2));
});

ipcMain.on('load-config', async (event) => {
    const file = readFileSync( CONFIG_PATH );
    const config: ConfigSchema = JSON.parse(file.toString(), );
})