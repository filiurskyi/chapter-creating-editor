let writeActions = false;

function updateActions(actionName, json) {
    if (writeActions === false) return;

    fetch('/add-editor-action/' + localStorage.getItem('save-name'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: localStorage.getItem('uid'),
            actionName: actionName,
            action: JSON.stringify(json)
        })
    });

    fetch('/save-project/' + localStorage.getItem('save-name'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            blocks: blocks,
            arrows: arrows,
            checkList: checkList,
            bookmarks: bookmarks,
        })
    })
}

function update() {
    setTimeout(() => {
        writeActions = false;
        fetch('/get-editor-action/' + localStorage.getItem('save-name'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('uid')
        })
            .then(response => response.json())
            .then(data => {
                data.forEach(action => {
                    let block;
                    const json = JSON.parse(action.action);
                    switch (action.actionName) {
                        case 'block-moving':
                            block = blockById(json.id);

                            const delta = new Vector2(json.position.x, json.position.y).subtract(block.position);

                            block.placeToMousePosition(delta);

                            break;
                        case 'block-text-change':
                            block = blockById(json.id);
                            if (block.header.editorId === json.formId) {
                                block.header.input.textContent = json.text;
                            } else {
                                for (let i = 0; i < block.formsList.length; i++) {
                                    if (block.formsList[i].keyForm.editorId === json.formId) {
                                        block.formsList[i].keyForm.input.textContent = json.text;
                                        break;
                                    } else if (block.formsList[i].valueForm.editorId === json.formId) {
                                        block.formsList[i].valueForm.input.textContent = json.text;
                                        break;
                                    }
                                }
                            }
                            break;
                        case 'block-add-field':
                            block = blockById(json.id);
                            block.addKeyValueForm();
                            break;
                        case 'block-delete-field':
                            block = blockById(json.id);
                            for (let i = 0; i < block.formsList.length; i++) {
                                if (block.formsList[i].keyForm.editorId === json.formId) {
                                    block.formsList = block.formsList.filter(item => item !== block.formsList[i]);
                                    block.formsList[i].form.remove();
                                    break;
                                }
                            }
                            break;
                        case 'arrow-text-change':
                            arrow = arrowById(json.id);
                            arrow.form.input.textContent = json.text;
                            break;
                        case 'create-block':
                            block = new Block(new Vector2(json.position.x, json.position.y), blockSize, document.getElementById('workplace'));
                            block.editorId = json.id;
                            trySetBegin(block);
                            break;
                        case 'create-arrow':
                            fromBlock = blockById(json.from);
                            toBlock = blockById(json.to);
                            arrow = new Arrow(document.getElementById('workplace'), fromBlock);
                            arrow.setFrom(fromBlock.bottomPoint)
                            arrow.setTo(toBlock.topPoint, toBlock)
                            arrow.placeArrow()
                            fromBlock.arrowsList.push(arrow)
                            toBlock.arrowsList.push(arrow)
                            arrows.push(arrow)
                            break;
                        case 'delete-block':
                            block = blockById(json.id);
                            block.remove();
                            break;
                        case 'delete-arrow':
                            arrow = arrowById(json.id);
                            arrow.deleteArrow();
                            break;
                        default:
                            break;
                    }
                    writeActions = true;

                    update();
                });
            });
    }, 10);
}

function blockById(id) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].editorId === id) {
            return blocks[i];
        }
    }
}

function arrowById(id) {
    for (let i = 0; i < arrows.length; i++) {
        if (arrows[i].editorId === id) {
            return arrows[i];
        }
    }
}

update();