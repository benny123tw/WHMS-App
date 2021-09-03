window.addEventListener("DOMContentLoaded", () => {
    initButton();
    ipcRenderer.send('get-employee');
    ipcRenderer.send('get-projects');
});

import { ipcRenderer } from "electron/renderer";
import { UploadConfigSchema, Employee, Project } from "whms";

ipcRenderer.on('get-employee', (e, d) => {
    const userList: HTMLSelectElement = document.querySelector('#username-selector');
    employeeSelectorInit(userList, d);
    console.log(d)
});

ipcRenderer.on('get-projects', (e, d) => {
    const projectList: HTMLSelectElement = document.querySelector('#project-selector');
    projectSelectorInit(projectList, d);
    console.log(d)
});

ipcRenderer.on('save-to-web', (e, d) => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save');
    saveBtn.classList.remove('is-loading') ;
    createNotification('is-success', 'Work Record uploaded successfully');
});

function createNotification(flag: string, message: string) {
    const _div = document.createElement('div');
    _div.id = "notification";
    _div.classList.add("notification", flag, "show");
    const _btn = document.createElement('button');
    _btn.id = "delete";
    _btn.classList.add("delete");
    _div.appendChild(_btn);
    _div.append(message);
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(_div);

    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;

        $delete.addEventListener('click', () => {

            $notification.classList.remove('show');
            $notification.classList.add('hide');

            setTimeout(() => $notification.parentNode.removeChild($notification), 400);
        });

        setTimeout(() => {
            $notification.classList.add('hide');
            setTimeout(() => $notification.parentNode.removeChild($notification), 400);
        }, 3000)
    });
}

const employeeSelectorInit = (selector: HTMLSelectElement, list: Employee[]) => {
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option');
        option.value = list[i].account;
        option.textContent = list[i].name;
        option.selected = i == 0 ? true : false;
        option.title = list[i].name + '  ' + list[i].account;
        selector.appendChild(option);
    }
}

const projectSelectorInit = async (selector: HTMLSelectElement, list: Project[]) => {
    const emptyOption = document.createElement('option');
    emptyOption.value = "";
    emptyOption.textContent = "刪除選這行";
    emptyOption.selected = true;

    selector.appendChild(emptyOption);
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option');
        option.value = list[i].code; // TODO: Project save code 
        option.textContent = list[i].code ? list[i].code + ' ' + list[i].name : list[i].name;
        option.title = list[i].name;
        selector.appendChild(option);
    }
}

const initButton = (): void => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save');
    saveBtn.onclick = getConfigValue;
}

const getConfigValue = () => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save');
    saveBtn.classList.add('is-loading') ;
    
    const userList: HTMLSelectElement = document.querySelector('#username-selector');
    const projectList: HTMLSelectElement = document.querySelector('#project-selector');
    const textArea: HTMLTextAreaElement = document.querySelector('#content-editor');
    const dateStart: HTMLInputElement = document.querySelector('#date-start');
    const dateEnd: HTMLInputElement = document.querySelector('#date-end');
    const vac: HTMLSelectElement = document.querySelector('#pass-vac-selector');
    const data: UploadConfigSchema = {
        employeeAccount: userList.value,
        content: textArea.value,
        projectCode: projectList.value,
        dateStart: dateStart.value,
        dateEnd: dateEnd.value,
        passHoliday: vac.value == 'true' ? true : false,
        exclude: []
    }
    ipcRenderer.send('save-to-web', data);
}