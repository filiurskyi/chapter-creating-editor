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

    function setTransform() {
        zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    }

    zoom.onmousedown = function (e) {
        if (e.target === zoom)
            e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;

        if (isCtrlPressed && e.buttons === 1) zoom.classList.add('grabbing')
    }

    zoom.onmouseup = function (e) {
        panning = false;
        zoom.classList.remove('grabbing')
    }

    zoom.onmousemove = function (e) {
        if (e.target === zoom)
            e.preventDefault();
        if (!isCtrlPressed) return;
        if (!panning) return;
        if (e.buttons !== 1) return;

        pointX = (e.clientX - start.x)
        pointY = (e.clientY - start.y)
        setTransform();
    }

    zoom.onwheel = function (e) {
        let isScrollable = false;
        scrollable.forEach(s => {
            if (isScrollable === false) {
                if (s === null || s === undefined) {
                    scrollable.filter(item => item !== s);
                }
                if (s === e.target) {
                    isScrollable = true;
                }
            }
        });

        if (isScrollable == false || isCtrlPressed)
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
    }

    setTransform();
})