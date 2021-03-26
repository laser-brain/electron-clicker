const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld(
    'api', {
        send: (channel, data) => {            
            let validChannels = ['toMain'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['fromMain'];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);

window.addEventListener('DOMContentLoaded', async () => {
    // load user name
    const user = localStorage.getItem('user');
    if(user) {
        document.getElementById('user').value = user;
    }

    // load data from server
    const response = await fetch(`${process.env.SERVER_URI}/api/click`);
    const data = await response.json();
    document.getElementById('clicks').textContent = `Count: ${data.clicks}`;
});
