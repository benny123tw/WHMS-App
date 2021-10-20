import { ipcMain, dialog, app } from 'electron';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import whms, { UploadConfigSchema } from 'whms';

const dataPath = app.isPackaged
    ? path.join(process.resourcesPath, "data")
    : "data";
const CONFIG_PATH = path.join(process.cwd(), dataPath, 'config.json');

ipcMain.handle('save-to-web', async (event, data: string) => {
    let result = false;
    const config: UploadConfigSchema = JSON.parse(data);
    // const response = await outputFile(CONFIG_PATH, data);
    // if (!response.result) return false;

    const res = await whms.upload(config);
    console.log(res)
    if (res.length) 
        result = true;

    return result;
});

async function outputFile(path: string, data: any, options?: any) {
    if (typeof path != "string") return;

    const dir = path.slice(0, path.lastIndexOf("\\") + 1);
    let result: boolean, error: Error;
    try {
        await mkdir(dir, { recursive: true });
        await writeFile(path, data, options);
        result = true;
    } catch (err) {
        error = err;
        result = false;
    } 

    return {
        result: result,
        error: error
    }
}
