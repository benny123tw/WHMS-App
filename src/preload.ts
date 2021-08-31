window.addEventListener("DOMContentLoaded", () => {
    // initSelector();
    initButton();
    ipcRenderer.send('get-employee');
    ipcRenderer.send('get-project');
});

import { ipcRenderer } from "electron/renderer";
import { ConfigSchema } from "./type/ConfigSchema";

ipcRenderer.on('get-employee', (e, d) => {
    const userList: HTMLSelectElement = document.querySelector('#username-selector');
    setSelectorValue(userList, d);
    console.log(d)
})

ipcRenderer.on('get-project', (e, d) => {
    const projectList: HTMLSelectElement = document.querySelector('#project-selector');
    setSelectorValue(projectList, d);
    console.log(d)
})

const setSelectorValue = async (selector: HTMLSelectElement, list: Array<any>) => {
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option');
        option.value = list[i].code ? list[i].code + ' ' + list[i].name : list[i].name;
        option.textContent = option.value;
        option.selected = i == 0 ? true : false;
        option.title = option.value;
        selector.appendChild(option);
    }
}

const initButton = (): void => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save');
    saveBtn.onclick = getConfigValue;
}

const getConfigValue = () => {
    const userList: HTMLSelectElement = document.querySelector('#username-selector');
    const projectList: HTMLSelectElement = document.querySelector('#project-selector');
    const textArea: HTMLTextAreaElement = document.querySelector('#content-editor');
    const dateStart: HTMLInputElement = document.querySelector('#date-start');
    const dateEnd: HTMLInputElement = document.querySelector('#date-end');
    const vac: HTMLSelectElement = document.querySelector('#pass-vac-selector');
    const data: ConfigSchema = {
        employeeAccount: userList.value,
        content: textArea.value,
        projectCode: projectList.value,
        dateStart: dateStart.value,
        dateEnd: dateEnd.value,
        passHoliday: vac.value == 'true' ? true : false,
        exclude: []
    }
    ipcRenderer.send('save-to-config', data);
}

// const initSelector = (): void => {
//     const userList: HTMLSelectElement = document.querySelector('#username-selector');
//     const projectList: HTMLSelectElement = document.querySelector('#project-selector');

//     for (let i = 0; i < 5; i++) {
//         const option = document.createElement('option');
//         option.value = "Benny " + (i + 1);
//         option.textContent = option.value;
//         option.selected = i == 0 ? true : false;
//         option.title = option.value;
//         userList.appendChild(option);
//     }

//     for (let i = 0; i < 5; i++) {
//         const option = document.createElement('option');
//         option.value = "Project " + (i + 1);
//         option.textContent = option.value;
//         option.selected = i == 0 ? true : false;
//         option.title = option.value;
//         projectList.appendChild(option);
//     }
// }