document.addEventListener('DOMContentLoaded', () => {
    const scaleRate = 0.1;
    const minScale = 0.1
    const maxScale = 1 - scaleRate
    const workplace = document.getElementById('workplace');

    let isCtrlPressed = false;

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey) {
            isCtrlPressed = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (!event.ctrlKey) {
            isCtrlPressed = false;
        }
    });

    workplace.addEventListener('wheel', (e) => {
        if (isCtrlPressed == false) return;

        e.preventDefault();

        const delta = -e.deltaY / 100;
        const deltaScale = delta * scaleRate;
        const lastScale = scale
        scale += deltaScale

        cellSize.x = startCellSize.x * scale
        cellSize.y = startCellSize.y * scale

        scale = Math.min(Math.max(minScale, scale), maxScale);

        blocks.forEach(block => {
            const rawBlockDelta = mousePosition.subtract(block.position);
            const blockDelta = mousePosition.subtract(block.position);

            blockDelta.x *= scale;
            blockDelta.y *= scale;
            blockDelta.x /= lastScale;
            blockDelta.y /= lastScale;

            block.placeToMousePosition(rawBlockDelta.subtract(blockDelta), true)
            block.docElement.style.transform = "scale(" + scale + ")";
        })

        arrows.forEach(arrow => {
            arrow.form.form.style.transform = "scale(" + scale + ") translateY(-10px)";
            arrow.placeArrow();
        })

        recalculateDots()
    });
})