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
    const dotMargin = new Vector2(mapValue(cellSize.x, 2.5, 25, 15, 25), mapValue(cellSize.y, 3.5, 25, 15, 25));

    var rect = workplace.getBoundingClientRect();
    const minLeft = Math.round(-rect.left / dotMargin.x) * dotMargin.x
    const minTop = Math.round(-rect.top / dotMargin.x) * dotMargin.x

    const maxLeft = minLeft + screen.width
    const maxTop = minTop + screen.height

    dots.forEach(element => {
        element.remove()
    });

    dots = []

    for (let x = minLeft; x < maxLeft; x += dotMargin.x) {
        for (let y = minTop; y < maxTop; y += dotMargin.y) {
            const dot = document.createElement('div');
            dot.style.left = (x + (dotMargin.x - dotsSize.x) / 2) + 'px';
            dot.style.top = (y + (dotMargin.y - dotsSize.y) / 2) + 'px';
            dot.style.width = dotsSize.x + 'px'
            dot.style.height = dotsSize.y + 'px'

            dot.classList.add('dot');
            workplace.appendChild(dot);
            dots.push(dot)
        }
    }

    function mapValue(value, minRange, maxRange, minMapped, maxMapped) {
        let normalized = (value - minRange) / (maxRange - minRange);
        let mappedValue = minMapped + normalized * (maxMapped - minMapped);

        return Math.max(minMapped, Math.min(mappedValue, maxMapped));
    }
}