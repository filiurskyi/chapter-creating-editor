document.addEventListener('DOMContentLoaded', (event) => {
    const workplace = document.getElementById('workplace')

    var rect = workplace.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top)

    document.addEventListener('mousemove', function (e) {
        var rect = workplace.getBoundingClientRect();

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
                    arrowToMove.setTo(blocks[i].topPoint, blocks[i])
                    blocks[i].arrowsList.push(arrowToMove)
                }
            }
            if (arrowToMove.to == null) {
                arrowToMove.deleteArrow()
            }
            else {
                arrowToMove.fromBlock.arrowsList.push(arrowToMove)
                arrows.push(arrowToMove)
                arrowToMove.placeArrow()
            }
            arrowToMove = null
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 0) {
            blocks.forEach(b => b.docElement.classList.remove('selected'));
        }
        else if (e.button === 1) {
            e.preventDefault()
        }
    })

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Delete') {
            blocks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    b.remove()
                }
            })
        }
    });
})