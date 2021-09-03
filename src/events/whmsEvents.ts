import { ipcMain } from 'electron';
import whms from 'whms';

ipcMain.on('get-employee', async (e, d) => {
    const data = await whms.get({
        method: 'getEmployees',
        data: {
            employeeShowDisabled: true
        }
    });

    e.sender.send('get-employee', data);
});

ipcMain.on('get-projects', async (e, d) => {
    const data = await whms.get({
        method: 'getProjects',
        data: {}
    });

    e.sender.send('get-projects', data);
});
