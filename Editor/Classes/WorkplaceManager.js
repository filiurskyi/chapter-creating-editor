let dots = []
const dotsSize = new Vector2(5, 5)

document.addEventListener('DOMContentLoaded', () => {
    const workplaceSize = new Vector2(10000, 10000)
    let isCtrlPressed = false;
    var panning = false,
        pointX = -workplaceSize.x * screen.width / 200,
        pointY = -workplaceSize.y * screen.height / 200,
        start = { x: 0, y: 0 },
        zoom = document.getElementById("zoom"),
        minScale = 0.1,
        maxScale = 1;

    const workplace = document.getElementById('workplace')
    zoom.style.minWidth = workplaceSize.x + 'vw'
    zoom.style.minHeight = workplaceSize.y + 'vh'

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
        if (isCtrlPressed == false && e.target === workplace)
            e.preventDefault()
    });

    function setTransform() {
        zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    }

    zoom.onmousedown = function (e) {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;

        if (isCtrlPressed) zoom.classList.add('grabbing')
    }

    zoom.onmouseup = function (e) {
        panning = false;
        // recalculateDots();
        zoom.classList.remove('grabbing')
    }

    zoom.onmousemove = function (e) {
        e.preventDefault();
        if (!isCtrlPressed) return;
        if (!panning) return;

        pointX = (e.clientX - start.x)
        pointY = (e.clientY - start.y)
        setTransform();
    }

    zoom.onwheel = function (e) {
        e.preventDefault();

        if (!isCtrlPressed) return;

        var xs = (e.clientX - pointX) / scale,
            ys = (e.clientY - pointY) / scale,
            delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);

        scale = Math.min(Math.max(minScale, scale), maxScale);

        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;

        setTransform();
        // recalculateDots();
    }

    setTransform();
    // recalculateDots();
})

function recalculateDots() {
    const cellRate = 20;
    const dotMargin = new Vector2(cellSize.x * cellRate, cellSize.y * cellRate);

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

    // function mapValue(value, minRange, maxRange, minMapped, maxMapped) {
    //     let normalized = (value - minRange) / (maxRange - minRange);
    //     let mappedValue = minMapped + normalized * (maxMapped - minMapped);

    //     return Math.max(minMapped, Math.min(mappedValue, maxMapped));
    // }
}