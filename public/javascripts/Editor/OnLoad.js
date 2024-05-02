document.addEventListener('DOMContentLoaded', (event) => {
    const workplace = document.getElementById('workplace');
    let cursors = [];

    if (localStorage.getItem('uid') === null) {
        location.href = '/login';
        return;
    }

    writeActions = false;

    fetch('/load-project/' + localStorage.getItem('save-name'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: localStorage.getItem('uid').toString()
        })
    })
        .then(response => response.json())
        .then(data => {
            const bufferArray = new Uint8Array(data.data);
            const bufferString = new TextDecoder('utf-8').decode(bufferArray);
            const dataObject = JSON.parse(bufferString);
            fromJSONConvert(dataObject, workplace);
        })

    let autosave = () => {
        setTimeout(() => {
            fetch('/save-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: localStorage.getItem('save-name'),
                    save: {
                        blocks: blocks,
                        arrows: arrows,
                        checkList: checkList,
                        bookmarks: bookmarks,
                    }
                })
            })
            autosave();
        }, autosaveDelay * 60000);
    };

    // autosave();

    let cursorUpdate = () => {
        setTimeout(() => {
            fetch('/cursor-positions-update/' + localStorage.getItem('save-name'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: localStorage.getItem('uid'),
                    x: mousePosition.x,
                    y: mousePosition.y,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == undefined) return;

                    data = data.filter(item => item.id !== localStorage.getItem('uid'));

                    while (data.length > cursors) {
                        cursors.push(new Cursor(workplace));
                    }
                    while (data.length < cursors) {
                        const cursor = cursors.pop();
                        cursor.remove();
                    }
                    for (let i = 0; i < data.length; i++) {
                        cursors[i].update(data[i].id, data[i].position.x, data[i].position.y);
                    }

                    cursorUpdate();
                })
        }, 100);
    }

    cursorUpdate();
});