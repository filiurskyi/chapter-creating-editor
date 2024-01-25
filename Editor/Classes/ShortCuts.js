document.addEventListener('DOMContentLoaded', () => {
    const fileInputToLoad = document.getElementById('fileInputToLoad');
    const workplace = document.getElementById('workplace');
    const popup = document.getElementById('popup');

    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S' || event.key === 'ы' || event.key === 'Ы')) {
            event.preventDefault();
            save();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'o' || event.key === 'O' || event.key === 'щ' || event.key === 'Щ')) {
            event.preventDefault();
            load();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В')) {
            event.preventDefault();
            duplicate();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'e' || event.key === 'E' || event.key === 'у' || event.key === 'У')) {
            event.preventDefault();
            showChapterPopup();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'i' || event.key === 'I' || event.key === 'ш' || event.key === 'Ш')) {
            event.preventDefault();
            statsPopupOpen();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'h' || event.key === 'H' || event.key === 'р' || event.key === 'Р')) {
            event.preventDefault();
            popupHelp();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 't' || event.key === 'T' || event.key === 'е' || event.key === 'Е')) {
            event.preventDefault();
            settingsPopup();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'r' || event.key === 'R' || event.key === 'к' || event.key === 'К')) {
            event.preventDefault();
            return;
        }
    });

    document.getElementById("loadButton").addEventListener('click', load)

    document.getElementById("exportButton").addEventListener('click', showChapterPopup)
    document.getElementById("stats-export").addEventListener('click', showChapterPopup)

    document.getElementById("helpButton").addEventListener('click', popupHelp)

    fileInputToLoad.addEventListener('change', (event) => {
        const files = event.target.files;
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            let parsedData = JSON.parse(text);
            fromJSONConvert(parsedData, workplace)
        };

        reader.readAsText(files[0]);
    });

    document.getElementById("saveButton").addEventListener('click', save)

    function duplicate() {
        const dupBlocks = []
        blocks.forEach(b => {
            if (b.docElement.classList.contains('selected')) {
                const original = b

                const point = new Vector2(original.position.x + 250, original.position.y + 250)

                let adjustedPosition = new Vector2(
                    Math.round(point.x / cellSize.x) * cellSize.x,
                    Math.round(point.y / cellSize.y) * cellSize.y
                );

                let block = new Block(adjustedPosition, blockSize, workplace, blocks.length)
                block.formsList = []
                block.arrowsList = []

                block.header.input.textContent = original.header.input.textContent

                original.formsList.forEach(form => {
                    const newForm = new KeyValuePairForm(block, fieldTypes, block.addButton, block.formsList.length)
                    newForm.keyForm.input.textContent = form.keyForm.input.textContent
                    newForm.valueForm.input.textContent = form.valueForm.input.textContent
                    block.formsList.push(newForm)
                });

                dupBlocks.push(block);
            }
        })

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        dupBlocks.forEach(b => {
            b.docElement.classList.add('selected');
            blocks.push(b);
        });
    }

    function load() {
        fileInputToLoad.click();
    }

    function save() {
        blocks.sort((a, b) => {
            const scaleRate = 3;
            const ax = Math.round(a.position.x * cellSize.x * scaleRate) / (cellSize.x * scaleRate);
            const ay = Math.round(a.position.y * cellSize.x * scaleRate) / (cellSize.x * scaleRate);

            const bx = Math.round(b.position.x * cellSize.x * scaleRate) / (cellSize.x * scaleRate);
            const by = Math.round(b.position.y * cellSize.x * scaleRate) / (cellSize.x * scaleRate);

            if (ay === by) {
                return ax - bx;
            }
            return ay - by;
        });

        blocks.forEach((block, index) => {
            block.id = index + 1;
        });

        let data = {
            blocks: blocks,
            arrows: arrows,
        };

        let jsonString = JSON.stringify(data);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = "save.cce";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showChapterPopup() {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-open")) return;

        document.getElementById('chapter-poput-input').value = '';

        chapterPopup.style.display = 'flex';
        chapterPopup.classList.remove('popup-close');
        chapterPopup.classList.add('popup-open');
    }

    document.getElementById('chapter-poput-submit').addEventListener('click', () => {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-close")) return;
        const input = document.getElementById('chapter-poput-input').value;
        console.log(input);

        let num = Number(input);
        if (num === null || num === undefined || isNaN(num)) num = 0;
        exportToFile(num);

        chapterPopup.classList.remove('popup-open');
        chapterPopup.classList.add('popup-close');

        setTimeout(() => {
            chapterPopup.style.display = 'none';
        }, 450);
    });

    document.getElementById('chapter-poput-cancel').addEventListener('click', () => {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-close")) return;

        chapterPopup.classList.remove('popup-open');
        chapterPopup.classList.add('popup-close');

        setTimeout(() => {
            chapterPopup.style.display = 'none';
        }, 450);
    });

    function exportToFile(chapter) {
        const json = exportToJson(chapter);

        let blob = new Blob([json], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = `chapter${chapter}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function popupHelp() {
        if (popup.classList.contains("popup-open")) {
            closePopup();
        } else {
            popup.style.display = 'flex';
            popup.classList.remove('popup-close');
            popup.classList.add('popup-open');
        }
    }

    document.getElementById('close').addEventListener('click', closePopup)

    function closePopup() {
        popup.classList.remove('popup-open');
        popup.classList.add('popup-close');

        setTimeout(() => {
            popup.style.display = 'none';
        }, 450);
    }

    document.getElementById("statButton").addEventListener('click', statsPopupOpen)

    function statsPopupOpen() {
        document.getElementById("stats").style.display = "block";
        setTimeout(() => {
            document.getElementById("stats-window").classList.remove("window-close");
            document.getElementById("stats-window").classList.add("window-open");
        }, 1)
    }

    document.getElementById('stats-close').addEventListener('click', statsPopupClose)

    function statsPopupClose() {
        document.getElementById("stats-window").classList.add("window-close");
        document.getElementById("stats-window").classList.remove("window-open");

        setTimeout(() => {
            document.getElementById("stats").style.display = "none";
        }, 300)
    }

    function settingsPopup() {

    }
})