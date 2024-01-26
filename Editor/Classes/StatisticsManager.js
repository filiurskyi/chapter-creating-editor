document.addEventListener('DOMContentLoaded', () => {
    const Window = {
        METRICS: 'METRICS',
        CONSOLE: 'CONSOLE',
        LIST: 'LIST'
    }

    const metrics = document.getElementById('stat-metrics');
    const statConsole = document.getElementById('stat-console');
    const list = document.getElementById('stat-list');
    const icon = document.getElementById('stat-icon');
    const body = document.getElementById('stats-main-body');

    document.getElementById('statButton').addEventListener('click', () => setWindow(Window.METRICS))
    document.getElementById('stats-close').addEventListener('click', () => setWindow(Window.METRICS))

    document.getElementById('stat-metrics').addEventListener('click', () => setWindow(Window.METRICS))
    document.getElementById('stat-console').addEventListener('click', () => setWindow(Window.CONSOLE))
    document.getElementById('stat-list').addEventListener('click', () => setWindow(Window.LIST))

    function setWindow(window) {
        body.innerHTML = '';

        metrics.classList.remove("active");
        statConsole.classList.remove("active");
        list.classList.remove("active");

        metrics.classList.remove("unactive");
        statConsole.classList.remove("unactive");
        list.classList.remove("unactive");

        switch (window) {
            case Window.METRICS:
                metrics.classList.add("active");
                statConsole.classList.add("unactive");
                list.classList.add("unactive");
                getMetrics();
                break;
            case Window.CONSOLE:
                metrics.classList.add("unactive");
                statConsole.classList.add("active");
                list.classList.add("unactive");
                getConsoleErrors();
                break;
            case Window.LIST:
                metrics.classList.add("unactive");
                statConsole.classList.add("unactive");
                list.classList.add("active");
                getCheckList();
                break;
            default:
                break;
        }
    }

    function getMetrics() {
        const values = [];
        values[0] = blocks.length;
        for (let i = 1; i < metricsList.length; i++) {
            values[i] = 0;
        }

        let blockPosition2 = null;
        let blockPosition11 = null;

        const backgroundsSet = new Set();
        blocks.forEach(block => {
            const frameType = block.header.input.textContent;
            (frameType === 'Text') ? values[2]++ : values[2] = 0;
            if (values[2] > metricsList[2][3] && blockPosition2 === null) {
                blockPosition2 = block.position;
            }

            if (frameType === 'Option') {
                block.formsList.forEach(fl => {
                    if (fl.keyForm.input.textContent === 'premium' && fl.valueForm.input.textContent === 'true') {
                        values[3]++;
                    }
                    if (fl.keyForm.input.textContent === 'luck-check') {
                        values[5]++;
                    }
                });
            }

            if (frameType === 'Lucky') values[4]++;
            if (frameType === 'Customize') values[6]++;

            if (frameType === 'Love') {
                block.formsList.forEach(fl => {
                    const value = fl.valueForm.input.textContent;
                    if (fl.keyForm.input.textContent === 'character') {
                        if (value === 'Favn')
                            values[7]++;
                        else if (value === 'dealer') {
                            values[8]++;
                        }
                    }
                });
            }

            block.formsList.forEach(fl => {
                if (fl.keyForm.input.textContent === 'location') {
                    const value = fl.valueForm.input.textContent;
                    if (value === 'moon_mother') {
                        values[10]++;
                    }

                    if (value !== undefined && backgroundsSet.has(value) === false) {
                        backgroundsSet.add(value);
                    }
                }

                if (fl.keyForm.input.textContent === 'text') {
                    const length = fl.valueForm.input.textContent.length;
                    if (fl.valueForm.input.textContent !== 'None' && length > values[11]) values[11] = length;

                    if ((values[11] > metricsList[11][3] || values[11] < metricsList[11][0]) && blockPosition11 === null) {
                        blockPosition11 = block.position;
                    }
                }
            });

            if (frameType === 'Choice') {
                values[1]++;
                const props = [false, false, false];

                block.arrowsList.forEach(arrow => {
                    if (arrow.toBlock.header.input.textContent === 'Option') {
                        let nextBlock = arrow.toBlock.arrowsList[1]?.toBlock;
                        arrow.toBlock.arrowsList.forEach(al => {
                            if (al.toBlock.header.input.textContent !== 'Option')
                                nextBlock = al.toBlock;
                        });
                        if (nextBlock !== undefined) {
                            if (nextBlock.header.input.textContent === 'Item') {
                                nextBlock.formsList.forEach(fl => {
                                    if (fl.keyForm.input.textContent === 'item-name') {
                                        switch (fl.valueForm.input.textContent) {
                                            case 'rose':
                                                props[0] = true;
                                                break;
                                            case 'key':
                                                props[1] = true;
                                                break;
                                            case 'crown':
                                                props[2] = true;
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                });
                            }
                        }
                    }
                });

                if (props[0] && props[1] && props[2]) values[9]++;
            }
        });

        values[1] = (values[0] - values[1]) / ((values[1] === 0) ? 1 : values[1]);
        values[1] = Math.round(values[1] * 10) / 10;

        values[12] = backgroundsSet.size;

        let state = StatState.GOOD;

        for (let i = 0; i < values.length; i++) {
            const element = document.createElement('div');
            element.classList.add("stat-field");
            element.classList.add(i % 2 === 0 ? "pair" : "odd");

            const statIcon = document.createElement('img');
            statIcon.src = "Images/Icons/error.png";
            let iStat = StatState.ERROR;
            if (values[i] > metricsList[i][1] && values[i] < metricsList[i][2]) {
                statIcon.src = "Images/Icons/warning.png";
                iStat = StatState.WARNING;
            }
            else if (values[i] > metricsList[i][3] && values[i] < metricsList[i][4]) {
                statIcon.src = "Images/Icons/warning.png";
                iStat = StatState.WARNING;
            }
            else if (values[i] >= metricsList[i][2] && values[i] <= metricsList[i][3]) {
                statIcon.src = "Images/Icons/good.png";
                iStat = StatState.GOOD;
            }
            statIcon.draggable = false;

            element.appendChild(statIcon);

            if ((state === StatState.GOOD) || (state === StatState.WARNING && iStat === StatState.ERROR)) {
                state = iStat;
            }

            const name = document.createElement('p');
            name.textContent = metricsList[i][0];
            element.appendChild(name);

            const value = document.createElement('p');
            value.textContent = values[i];
            element.appendChild(value);

            if (metricsList[i][5] && iStat !== StatState.GOOD) {
                const statArrow = document.createElement('img');
                statArrow.src = "Images/Icons/link.png";
                statArrow.draggable = false;
                statArrow.addEventListener('click', () => {
                    if (i === 2 && blockPosition2 === null) return;
                    if (i === 11 && blockPosition11 === null) return;

                    moveViewportTo((i === 2) ? blockPosition2 : (i === 11) ? blockPosition11 : new Vector2(0, 0));

                    document.getElementById("stats-window").classList.add("window-close");
                    document.getElementById("stats-window").classList.remove("window-open");

                    setTimeout(() => {
                        document.getElementById("stats").style.display = "none";
                    }, 300);
                })
                element.appendChild(statArrow);
            }

            body.appendChild(element);
        }

        switch (state) {
            case StatState.GOOD:
                icon.src = "Images/Icons/good.png";
                break;
            case StatState.WARNING:
                icon.src = "Images/Icons/warning.png";
                break;
            case StatState.ERROR:
                icon.src = "Images/Icons/error.png";
                break;
            default:
                break;
        }
    }

    function getConsoleErrors() {
        let textChainLength = 0;
        const errors = [];
        blocks.forEach(block => {
            const frameType = block.header.input.textContent;

            if (frameTypes.get(frameType) === undefined) {
                errors.push({ message: errorsList[3][0] + " (" + frameType + ")", state: errorsList[3][1], position: block.position })
            }

            (frameType === 'Text') ? textChainLength++ : textChainLength = 0;
            if (textChainLength > metricsList[2][3]) {
                errors.push({ message: errorsList[1][0], state: errorsList[1][1], position: block.position })
            }

            block.formsList.forEach(fl => {
                const content = fl.keyForm.input.textContent;
                if (content === 'text') {
                    const length = fl.valueForm.input.textContent.length;
                    if (length > metricsList[11][3] || length < metricsList[11][0]) {
                        errors.push({ message: errorsList[2][0], state: errorsList[2][1], position: block.position })
                    }
                }

                if (fieldTypes[content] === undefined) {
                    errors.push({ message: errorsList[4][0] + " (" + content + ")", state: errorsList[4][1], position: block.position })
                }
            });

            const props = [false, false, false];
            let forkLength = 0;
            if (frameType === 'Choice') {
                block.arrowsList.forEach(arrow => {
                    if (arrow.toBlock.header.input.textContent === 'Option') {
                        forkLength++;
                        let nextBlock = undefined;
                        arrow.toBlock.arrowsList.forEach(al => {
                            if (al.toBlock.header.input.textContent !== 'Option')
                                nextBlock = al.toBlock;
                        });
                        if (nextBlock !== undefined) {
                            if (nextBlock.header.input.textContent === 'Item') {
                                nextBlock.formsList.forEach(fl => {
                                    if (fl.keyForm.input.textContent === 'item-name') {
                                        switch (fl.valueForm.input.textContent) {
                                            case 'rose':
                                                props[0] = true;
                                                break;
                                            case 'key':
                                                props[1] = true;
                                                break;
                                            case 'crown':
                                                props[2] = true;
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                });
                            }
                        } else {
                            errors.push({ message: errorsList[6][0], state: errorsList[6][1], position: arrow.toBlock.position })
                        }
                    }
                    else {
                        errors.push({ message: errorsList[7][0], state: errorsList[7][1], position: block.position })
                    }
                });

                const trueCount = props.filter(Boolean).length;
                if (trueCount !== 0) {
                    if (forkLength !== 4) {
                        errors.push({ message: errorsList[5][0], state: errorsList[5][1], position: block.position })
                    }
                    if (trueCount === 1 || trueCount === 2) {
                        errors.push({ message: errorsList[0][0], state: errorsList[0][1], position: block.position })
                    }
                }
            }

            let fromArrowsCount = 0;
            block.arrowsList.forEach(arrow => {
                if (arrow.toBlock !== block) {
                    fromArrowsCount++;
                }
            });

            if (block.arrowsList.length === 0) {
                errors.push({ message: errorsList[9][0] + " (" + frameType + ")", state: errorsList[9][1], position: block.position });
            }

            const linearFrames = ["Text", "Dialog", "Option", "Item", "Customize", "Love", "Lucky", "Bubble", "Animation"];

            if ((linearFrames.includes(frameType) && fromArrowsCount > 1) || (!linearFrames.includes(frameType) && fromArrowsCount < 2)) {
                errors.push({ message: errorsList[8][0] + " (" + frameType + ")", state: errorsList[8][1], position: block.position });
            }
        });

        let i = 0;
        errors.forEach(error => {
            const element = document.createElement('div');
            element.classList.add("stat-field");
            element.classList.add(i++ % 2 === 0 ? "pair" : "odd");

            const statIcon = document.createElement('img');
            switch (error.state) {
                case StatState.WARNING:
                    statIcon.src = "Images/Icons/warning.png";
                    break;
                case StatState.ERROR:
                    statIcon.src = "Images/Icons/error.png";
                    break;
                default:
                    break;
            }
            statIcon.draggable = false;
            element.appendChild(statIcon);

            const name = document.createElement('p');
            name.textContent = error.message;
            element.appendChild(name);

            const statArrow = document.createElement('img');
            statArrow.src = "Images/Icons/link.png";
            statArrow.draggable = false;
            statArrow.addEventListener('click', () => {
                moveViewportTo(error.position);

                document.getElementById("stats-window").classList.add("window-close");
                document.getElementById("stats-window").classList.remove("window-open");

                setTimeout(() => {
                    document.getElementById("stats").style.display = "none";
                }, 300);
            })
            element.appendChild(statArrow);

            body.appendChild(element);
        });
    }

    function getCheckList() {

    }
})