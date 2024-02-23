document.addEventListener('DOMContentLoaded', (event) => {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    const workplace = document.getElementById('workplace')

    var rect = workplace.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top)

    document.addEventListener('mousemove', function (e) {
        var rect = workplace.getBoundingClientRect();

        let newMousePosition = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
        newMousePosition.x /= scale
        newMousePosition.y /= scale

        if (arrowToMove != null && state === State.ARROW_MOVING) {
            arrowToMove.placeArrow(new Vector2(e.clientX - 5, e.clientY - 5))
        }

        if (state === State.BLOCKS_MOVING) {
            let delta = newMousePosition.subtract(mousePosition)

            blocks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    b.placeToMousePosition(delta, cellSize)
                }

                trySetBegin(b);
            })
        }

        mousePosition = newMousePosition;
    });

    document.addEventListener('mouseup', function (e) {
        if (state === State.ARROW_MOVING && e.button === 0) {
            for (let i = 0; i < blocks.length; i++) {
                if (e.target === blocks[i].arrowTrigger) {
                    blocks[i].arrowsList.push(arrowToMove)
                    arrowToMove.setTo(blocks[i].topPoint, blocks[i])
                }
            }

            blocks.forEach(b => {
                b.arrowTrigger.style.display = 'none';
            });

            if (arrowToMove.to == null) {
                invokeContextMenu();
            }
            else {
                arrowToMove.fromBlock.arrowsList.push(arrowToMove);
                arrows.push(arrowToMove);
                arrowToMove.placeArrow();

                state = State.NONE;
            }
        }

        if (state === State.BLOCK_CONNECTION && blockToConnect !== null && e.button !== 1) {
            state = State.NONE;

            if (e.button === 2) {
                for (let i = 0; i < blocks.length; i++) {
                    if (e.target === blocks[i].arrowTrigger && blocks[i] !== blockToConnect) {
                        const arrow = new Arrow(workplace, blockToConnect);
                        arrow.setFrom(blockToConnect.bottomPoint);
                        arrow.setTo(blocks[i].topPoint, blocks[i]);
                        arrow.placeArrow();

                        blockToConnect.arrowsList.push(arrow);
                        blocks[i].arrowsList.push(arrow);
                        arrows.push(arrow);

                        break;
                    }
                }
            }

            blockToConnect = null;

            blocks.forEach(b => {
                b.arrowTrigger.style.display = 'none';
            });

            document.getElementById("block-connection-info-panel").style.display = 'none';
        }

        if (state === State.BLOCKS_MOVING) {
            state = State.NONE;
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 0 && state === State.NONE && e.target === workplace) {
            blocks.forEach(b => b.docElement.classList.remove('selected'));
            arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));
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

            arrows.forEach(a => {
                console.log(a.arrowParts[0].classList);
                if (a.arrowParts[0].classList.contains('selected')) {
                    a.deleteArrow()
                }
            })
        }
    });

    function callForever() {
        console.log(state);
        setTimeout(callForever, 100);
    }

    // callForever();
})