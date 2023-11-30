document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.getElementById('workplace')
    document.addEventListener('mousemove', function (e) {
        var rect = workplace.getBoundingClientRect();

        const sidePanel = document.getElementById('header')
        sidePanel.style.top = (-rect.top) + 'px';
        sidePanel.style.left = (-rect.left) + 'px';

        let newMousePosition = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
        let delta = newMousePosition.subtract(mousePosition)

        mousePosition = newMousePosition

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
                if (e.target === blocks[i].docElement) {
                    arrowToMove.setTo(blocks[i].topPoint, blocks[i].id, true)
                    blocks[i].arrowsList.push(arrowToMove)
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
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 2) {
            if (e.target == workplace)
                createBlock()
        }
    })

    function createBlock() {
        let adjustedPosition = new Vector2(
            Math.round(mousePosition.x / cellSize.x) * cellSize.x,
            Math.round(mousePosition.y / cellSize.y) * cellSize.y
        );

        let block = new Block(adjustedPosition, blockSize, workplace, blocks.length, blocks, arrowToMove, blockToMove)
        blocks.push(block)
    }
})