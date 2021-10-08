import { ipcRenderer } from "electron/renderer";
import { UploadConfigSchema, Employee, Project } from "whms";
import { checkLocalHost } from "./utils/online";

window.addEventListener("DOMContentLoaded", async () => {
    let firstConnectStatus = await checkLocalHost();
    onlineToast(firstConnectStatus);

    setInterval(async () => {
        const status = await checkLocalHost();
        onlineToast(status);

        if (!firstConnectStatus && status) {
            dataInit();
            firstConnectStatus = true;
        }
    }, 10000);

    if (firstConnectStatus) {
        dataInit();
    }
});

ipcRenderer.on('save-to-web', (e, response) => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save-btn');
    saveBtn.classList.remove('is-loading');

    // if (response.isSuccess)
    createNotification('is-success', '工時資料上傳成功!');
    // else
    //     createNotification('is-danger', '無法連接至http://192.168.8.188:8088/')
});

let firstTime = true;
function onlineToast(isOnline: boolean) {
    // Selecting all required elements
    const wrapper: HTMLDivElement = document.querySelector(".net-wrapper"),
        toast = wrapper.querySelector(".toast"),
        title: HTMLSpanElement = toast.querySelector(".details span"),
        subTitle: HTMLParagraphElement = toast.querySelector(".details p"),
        wifiIcon = toast.querySelector(".icon"),
        closeIcon: HTMLButtonElement = toast.querySelector(".delete"),
        saveBtn: HTMLButtonElement = document.querySelector("#save-btn");

    const userList: HTMLSelectElement = document.querySelector('#username-selector');

    if (firstTime && !isOnline) {
        wrapper.style.display = "block";
        firstTime = false;
    }

    function offline() { //function for offline
        wrapper.classList.remove("hide");
        toast.classList.add("offline");
        title.innerText = "連線失敗";
        subTitle.innerText = "請確認是否正確連線到AT！";

        saveBtn.disabled = true;
        saveBtn.onclick = null;
    }

    function online() {
        toast.classList.remove("offline");
        title.innerText = "連線成功";
        subTitle.innerText = "太好了！已經連線到AT。";
        closeIcon.onclick = () => { //hide toast notification on close icon click
            wrapper.classList.add("hide");
        }
        setTimeout(() => { //hide the toast notification automatically after 5 seconds
            wrapper.classList.add("hide");
        }, 3000);

        if (userList.value) {
            saveBtn.disabled = false;
            saveBtn.onclick = getConfigValue;
        }
    }

    isOnline ? online() : offline();
}

function dataGetSuccess() {
    const div = document.createElement('success');
    // div.id = "success";
    // div.hidden = true;
    document.querySelector('body').appendChild(div);
}

function createNotification(flag: string, message: string,) {
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

async function dataInit() {
    console.time("get")
    const userSelector: HTMLSelectElement = document.querySelector('#username-selector');
    const pendingList = [ipcRenderer.invoke('get-employee'), ipcRenderer.invoke('get-projects')];
    const result = await Promise.all(pendingList);
    const employeeList: Array<Employee> = result[0];
    employeeSelectorInit(userSelector, employeeList);

    const projectSelector: HTMLSelectElement = document.querySelector('#project-selector');
    const projectList: Array<Project> = result[1];
    projectSelectorInit(projectSelector, projectList);

    dataGetSuccess();
    // safeCheckSetup();
    console.timeEnd("get");
}

const employeeSelectorInit = (selector: HTMLSelectElement, list: Employee[]) => {
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option');
        option.value = list[i].account;
        option.title = list[i].name;
        // option.selected = i == 0 ? true : false; // TODO: select storage name
        option.textContent = list[i].name + '  ' + list[i].account;
        selector.add(option);
    }
}

const projectSelectorInit = (selector: HTMLSelectElement, list: Project[]) => {
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option');
        option.value = list[i].code; // TODO: Project save code 
        option.textContent = list[i].code ? list[i].code + ' ' + list[i].name : list[i].name;
        option.title = list[i].name;
        selector.add(option);
    }
}

const getConfigValue = () => {
    const saveBtn: HTMLButtonElement = document.querySelector('#save-btn');
    saveBtn.classList.add('is-loading');

    const userList: HTMLSelectElement = document.querySelector('#username-selector');
    const projectList: HTMLSelectElement = document.querySelector('#project-selector');
    const textArea: HTMLTextAreaElement = document.querySelector('#content-editor');
    const dateRange: HTMLInputElement = document.querySelector('#daterange');
    const startDate = dateRange.value.split(' ~ ')[0];
    const endDate = dateRange.value.split(' ~ ')[1];
    const excludeDates: HTMLInputElement = document.querySelector('#mdp');
    const passHoliday: HTMLInputElement = document.querySelector('#passHoliday');
    const data: UploadConfigSchema = {
        employeeAccount: userList.value,
        content: textArea.value || '',
        projectCode: projectList.value,
        dateStart: startDate,
        dateEnd: endDate,
        passHoliday: passHoliday.checked,
        exclude: excludeDates.value.split(', ')
    }
    ipcRenderer.send('save-to-web', JSON.stringify(data, null, 2));
}