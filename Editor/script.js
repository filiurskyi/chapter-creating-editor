let blocks = [];
let arrows = [];
let blockToMove;
let arrowToMove;

document.addEventListener('DOMContentLoaded', () => {
    const startWidth = 150;
    const startHeight = 100;
    const cellSize = new Vector2(25, 25)
    const workplace = document.getElementById('workplace')
    const fileInput = document.getElementById('fileInput');

    let mousePosition = new Vector2(0, 0)

    let isGrabbing = false;

    document.getElementById("loadButton").addEventListener('click', (e) => {
        fileInput.click();
    })

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            let parsedData = JSON.parse(text);
            fromJSONConvert(parsedData, blocks, arrows, new Vector2(startWidth, startHeight), workplace)
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

    document.addEventListener('mousemove', function (e) {
        var rect = workplace.getBoundingClientRect();

        const sidePanel = document.getElementById('header')
        sidePanel.style.top = (-rect.top) + 'px';
        sidePanel.style.left = (-rect.left) + 'px';

        let newMousePosition = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
        let delta = newMousePosition.subtract(mousePosition)

        mousePosition = newMousePosition

        if (isGrabbing) {
            e.preventDefault();
            window.scrollBy(startX - e.clientX, startY - e.clientY);
            startX = e.clientX;
            startY = e.clientY;
        }

        if (arrowToMove != null) {
            arrowToMove.placeArrow(new Vector2(e.clientX - 5, e.clientY - 5))
        }

        if (blockToMove == null) return;

        blockToMove.placeToMousePosition(delta, cellSize)
    });

    document.addEventListener('mouseup', function (e) {
        if (blockToMove && e.button === 0) {
            blockToMove = null
        }

        if (arrowToMove && e.button === 0) {
            for (let i = 0; i < blocks.length; i++) {
                if (e.target === blocks[i].topPoint) {
                    arrowToMove.setTo(blocks[i].topPoint, blocks[i].id, true)
                    blocks[i].arrowsList.push(arrowToMove)
                    break
                } else if (e.target === blocks[i].bottomPoint) {
                    arrowToMove.setTo(blocks[i].bottomPoint, blocks[i].id, false)
                    blocks[i].arrowsList.push(arrowToMove)
                    break
                }
            }
            if (arrowToMove.to == null) {
                arrowToMove.deleteArrow()
            }
            else {
                arrowToMove.startBlock.arrowsList.push(arrowToMove)
                arrows.push(arrowToMove)
                arrowToMove.placeArrow()
            }
            arrowToMove = null
        }

        if (e.button === 1) {
            isGrabbing = false;
            document.body.classList.remove('grabbing');
        }
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('mousedown', function (e) {
        switch (e.button) {
            case 0:
                break;
            case 1:
                isGrabbing = true;
                document.body.classList.add('grabbing');
                startX = e.clientX;
                startY = e.clientY;
                e.preventDefault();
                break;
            case 2:
                if (e.target == workplace)
                    createBlock()
                break;
            default:
                console.log('Different button clicked');
        }
    })

    function createBlock() {
        let size = new Vector2(startWidth, startHeight);

        let adjustedPosition = new Vector2(
            Math.round(mousePosition.x / cellSize.x) * cellSize.x,
            Math.round(mousePosition.y / cellSize.y) * cellSize.y
        );

        let block = new Block(adjustedPosition, size, workplace, blocks.length, blocks, arrowToMove, blockToMove)
        blocks.push(block)
    }

    workplace.addEventListener('wheel', (e) => {
        e.preventDefault();
    });
})