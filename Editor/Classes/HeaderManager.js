document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const workplace = document.getElementById('workplace')

    document.getElementById("loadButton").addEventListener('click', (e) => {
        fileInput.click();
    })

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

    document.getElementById("saveButton").addEventListener('click', (e) => {
        let data = {
            blocks: blocks,
            arrows: arrows
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
    })
})