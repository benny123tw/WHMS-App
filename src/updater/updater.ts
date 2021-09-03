import { ipcRenderer } from "electron/renderer";

ipcRenderer.on("message", (event, data) => {
    const message = document.getElementById("message");
    if (typeof data === "string") {
        message.innerText = data;
    } else {
        const progressBar: HTMLProgressElement = document.querySelector("#progressBar");
        const percentText = document.getElementById("percentText");
        const sizeText = document.getElementById("sizeText");
        message.innerText = 'Download Speed:' + formatBytes(data.bytesPerSecond);
        progressBar.value = data.percent;
        percentText.innerText = `${data.percent.toFixed(1)}%`; 
        sizeText.innerText = `${formatBytes(data.transferred)} / ${formatBytes(data.total)}`
    }
});

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}