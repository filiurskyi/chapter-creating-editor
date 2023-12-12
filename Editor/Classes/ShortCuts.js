document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const workplace = document.getElementById('workplace');

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
            exportToJSON();
        }
    });

    document.getElementById("loadButton").addEventListener('click', load)

    document.getElementById("exportButton").addEventListener('click', exportToJSON)

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

        if (original === null) return

        const point = new Vector2(mousePosition.x + 250, mousePosition.y + 250)

        let adjustedPosition = new Vector2(
            Math.round(point.x / cellSize.x) * cellSize.x,
            Math.round(point.y / cellSize.y) * cellSize.y
        );

        let block = new Block(adjustedPosition, blockSize, workplace, blocks.length)
        block.formsList = []
        block.arrowsList = []

        block.header.input.value = original.header.input.value

        original.formsList.forEach(form => {
            const newForm = new KeyValuePairForm(block.docElement, fieldTypes, fieldTypes, block.addButton, block.formsList.length)
            newForm.keyForm.input.value = form.keyForm.input.value
            newForm.valueForm.input.value = form.valueForm.input.value
            block.formsList.push(newForm)
        });

        blocks.push(block)
    }

    function load() {
        fileInput.click();
    }

    function save() {
        let data = {
            blocks: blocks,
            arrows: arrows,
            scale: scale,
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
})