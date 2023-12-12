let dots = []
const dotsSize = new Vector2(2, 2)

document.addEventListener('DOMContentLoaded', () => {
    let isCtrlPressed = false;
    let isLeftMouseButtonPressed = false;
    let startX
    let startY

    const workplace = document.getElementById('workplace')
    const workplaceSize = new Vector2(100000, 100000)
    workplace.style.minWidth = workplaceSize.x + 'px'
    workplace.style.minHeight = workplaceSize.y + 'px'

    recalculateDots();

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

    document.addEventListener('mousedown', function (e) {
        if (e.button === 0 && isCtrlPressed) {
            isLeftMouseButtonPressed = true;
            document.body.classList.add('grabbing');
            startX = e.clientX;
            startY = e.clientY;
        }
    })

    document.addEventListener('mouseup', function (e) {
        if (e.button === 0) {
            isLeftMouseButtonPressed = false;
            document.body.classList.remove('grabbing');
            recalculateDots()
        }
    })

    document.addEventListener('mousemove', (e) => {
        if (isCtrlPressed && isLeftMouseButtonPressed) {
            e.preventDefault();
            window.scrollBy(startX - e.clientX, startY - e.clientY);
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    workplace.addEventListener('wheel', (e) => {
        if (isCtrlPressed == false && e.target === workplace)
            e.preventDefault()
    });
})

function recalculateDots() {
    var rect = workplace.getBoundingClientRect();
    const minLeft = Math.round(-rect.left / cellSize.x) * cellSize.x
    const minTop = Math.round(-rect.top / cellSize.x) * cellSize.x

    const maxLeft = minLeft + screen.width
    const maxTop = minTop + screen.height

    dots.forEach(element => {
        element.remove()
    });

    dots = []

    if (cellSize.x < 15 && cellSize.y < 15) return

    for (let x = minLeft; x < maxLeft; x += cellSize.x) {
        for (let y = minTop; y < maxTop; y += cellSize.y) {
            const dot = document.createElement('div');
            dot.style.left = (x + (cellSize.x - dotsSize.x) / 2) + 'px';
            dot.style.top = (y + (cellSize.y - dotsSize.y) / 2) + 'px';
            dot.style.width = dotsSize.x + 'px'
            dot.style.height = dotsSize.y + 'px'

            dot.classList.add('dot');
            workplace.appendChild(dot);
            dots.push(dot)
        }
    }
}