let serverUri = '';

document.getElementById('exit').onclick = () => {
    window.api.send('toMain', { 'event': 'exit' });
};

window.api.receive("fromMain", (data) => {
    switch (data.event) {
        case 'set-server-uri':{
            serverUri = data.value;
        }
    }
});

document.getElementById('click').onclick = async () => {
    const user = document.getElementById('user').value;
    if (!user) {
        alert('You must set a user name!');
        return;
    }

    const response = await fetch(`${serverUri}/api/click`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            user
        })
    });
    const data = await response.json();
    document.getElementById('clicks').textContent = `Count: ${data.clicks}`;
}

[...document.getElementsByTagName('button')].forEach((button) => {
    button.addEventListener('click', () => {
        const user = document.getElementById('user').value;
        if (user) {
            localStorage.setItem('user', user);
        }
    });
});