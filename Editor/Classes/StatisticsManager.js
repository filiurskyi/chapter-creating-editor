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
                break;
            case Window.LIST:
                metrics.classList.add("unactive");
                statConsole.classList.add("unactive");
                list.classList.add("active");
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

        const backgroundsSet = new Set();
        blocks.forEach(block => {
            const frameType = block.header.input.textContent;
            (frameType === 'Text') ? values[2]++ : values[2] = 0;

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

            const statArrow = document.createElement('img');
            statArrow.src = "Images/Icons/link.png";
            element.appendChild(statArrow);

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
})