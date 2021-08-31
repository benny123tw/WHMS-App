import { ipcMain } from "electron";
import { readFileSync } from "fs";
import path = require("path");
import { Service } from "../service/Service";

export function eventInit() {
    const file = readFileSync(path.join(process.cwd(), "data", "base.json"));
    const baseConfig = JSON.parse(file.toString());

    ipcMain.on('get-employee', async (e: any, d: any) => {
        const em = new Service(baseConfig);
        const data = await em.get('getEmployees', { employeeShowDisabled: false })
        e.sender.send('get-employee', data)
    });

    ipcMain.on('get-project', async (e: any, d: any) => {
        const em = new Service(baseConfig);
        const data = await em.get('getProjects', {});;
        e.sender.send('get-project', data)
    });
}
