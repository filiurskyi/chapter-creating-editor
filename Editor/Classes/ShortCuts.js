document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const workplace = document.getElementById('workplace');
    const popup = document.getElementById('popup');

    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S')) {
            event.preventDefault();
            save();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'o' || event.key === 'O')) {
            event.preventDefault();
            load();
            return
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D')) {
            event.preventDefault();
            duplicate();
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'e' || event.key === 'E')) {
            event.preventDefault();
            showChapterPopup();
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'h' || event.key === 'H')) {
            event.preventDefault();

            popupHelp();
        }
    });

    document.getElementById("loadButton").addEventListener('click', load)

    document.getElementById("exportButton").addEventListener('click', showChapterPopup)
    document.getElementById("helpButton").addEventListener('click', popupHelp)

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            let parsedData = JSON.parse(text);
            fromJSONConvert(parsedData, blocks, arrows, blockSize, workplace)
        };

        reader.readAsText(files[0]);
    });

    document.getElementById("saveButton").addEventListener('click', save)

    function duplicate() {
        let original;

        blocks.forEach(b => {
            if (b.docElement.classList.contains('selected')) {
                original = b
            }
        })

        if (original === undefined) return

        const point = new Vector2(original.position.x + 250, original.position.y + 250)

        let adjustedPosition = new Vector2(
            Math.round(point.x / cellSize.x) * cellSize.x,
            Math.round(point.y / cellSize.y) * cellSize.y
        );

        let block = new Block(adjustedPosition, blockSize, workplace, blocks.length)
        block.formsList = []
        block.arrowsList = []

        block.header.input.value = original.header.input.value

        original.formsList.forEach(form => {
            const newForm = new KeyValuePairForm(block.docElement, fieldTypes, block.addButton, block.formsList.length)
            newForm.keyForm.input.value = form.keyForm.input.value
            newForm.valueForm.input.value = form.valueForm.input.value
            block.formsList.push(newForm)
        });

        blocks.push(block)

        block.select();
    }

    function load() {
        fileInput.click();
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
            block.text.textContent = block.id;
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
})