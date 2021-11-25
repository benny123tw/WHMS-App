import { ipcMain } from 'electron';
import whms from 'whms';

ipcMain.handle('get-employees', async (e, d) => {
    const response = await whms.get({
        method: 'getEmployees',
        data: {
            employeeShowDisabled: false
        }
    });

    return response;
});

ipcMain.handle('get-projects', async (e, d) => {
    const response = await whms.get({
        method: 'getProjects',
        data: {}
    });

    return response;
});
