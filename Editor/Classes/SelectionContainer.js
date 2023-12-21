document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.getElementById('workplace');
    const selectionContainer = document.getElementById('selection-container');
    let isSelection = false;
    let startSelection;

    selectionContainer.style.display = 'none';

    workplace.onmousedown = function (e) {
        if (e.button !== 0) return;

        if (state !== State.NONE) return;

        if (workplace !== e.target) return;

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        isSelection = true;
        startSelection = new Vector2(mousePosition.x, mousePosition.y);

        selectionContainer.style.display = 'block';
        selectionContainer.style.left = startSelection.x + "px";
        selectionContainer.style.top = startSelection.y + "px";

        state = State.SELECTING;
    }

    workplace.onmousemove = function (e) {
        if (isSelection === false) return;

        const size = mousePosition.subtract(startSelection);
        let left;
        let top;

        if (size.x < 0) {
            left = startSelection.x + size.x;
            selectionContainer.style.left = left + "px";
        }
        if (size.y < 0) {
            top = startSelection.y + size.y;
            selectionContainer.style.top = top + "px";
        }
        if (size.x >= 0 && size.y >= 0) {
            left = startSelection.x;
            top = startSelection.y;
            selectionContainer.style.left = left + "px";
            selectionContainer.style.top = top + "px";
        }

        selectionContainer.style.width = Math.abs(size.x) + "px";
        selectionContainer.style.height = Math.abs(size.y) + "px";

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        blocks.forEach(b => {
            if (
                b.position.x >= left &&
                b.position.y >= top &&
                b.position.x <= (left + size.x) &&
                b.position.y <= (top + size.y)
            ) {
                b.docElement.classList.add('selected');
            }
        });
    }

    workplace.onmouseup = function (e) {
        state = State.NONE;
        isSelection = false;
        selectionContainer.style.display = 'none';
        selectionContainer.style.width = "0px";
        selectionContainer.style.height = "0px";
    }
})