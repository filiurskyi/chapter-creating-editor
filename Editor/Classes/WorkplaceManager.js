let lastAddedBlock;
let pointX;
let pointY;

document.addEventListener('DOMContentLoaded', () => {
    const workplaceSize = new Vector2(10000, 10000)
    let isCtrlPressed = false;
    pointX = -workplaceSize.x * screen.width / 200;
    pointY = -workplaceSize.y * screen.height / 200;
    var panning = false,
        start = { x: 0, y: 0 },
        zoom = document.getElementById("zoom"),
        minScale = 0.1,
        maxScale = 1;

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

    zoom.onmousedown = function (e) {
        if (e.target === zoom)
            e.preventDefault();

        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;

        if (e.buttons === 4 || (isCtrlPressed && e.buttons === 1)) zoom.classList.add('grabbing')
    }

    zoom.onmouseup = function (e) {
        panning = false;
        zoom.classList.remove('grabbing')
    }

    zoom.onmousemove = function (e) {
        if (e.target === zoom)
            e.preventDefault();

        if (!panning) return;
        if (e.buttons === 4 || (isCtrlPressed && e.buttons === 1)) {
            pointX = (e.clientX - start.x)
            pointY = (e.clientY - start.y)
            setTransform();
        }
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

        if (isScrollable) return;

        e.preventDefault();

        if (panning) return;

        var xs = (e.clientX - pointX) / scale,
            ys = (e.clientY - pointY) / scale,
            delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);

        scale = Math.min(Math.max(minScale, scale), maxScale);

        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;

        setTransform();
    }

    document.getElementById("target").onclick = function (e) {
        if (lastAddedBlock === null || lastAddedBlock === undefined) return;

        const targetPosition = lastAddedBlock.position;

        moveViewportTo(targetPosition);
    };

    setTransform();

    setTimeout(() => {
        document.getElementById("loading-screen").remove();
        const imgElements = document.querySelectorAll('img');

        imgElements.forEach((img) => {
            img.setAttribute('draggable', 'false');
        });
    }, 100);
})

function setTransform() {
    zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    setLOD();
}

function moveViewportTo(targetPosition) {
    scale = 1.0;

    pointX = -targetPosition.x + screen.width / 2;
    pointY = -targetPosition.y + screen.height / 2;

    setTransform();
}

function setLOD() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;

    let leftTopVisibleCorner = new Vector2(-pointX / scale, -pointY / scale);
    let rightBottomVisibleCorner = new Vector2((width - pointX) / scale, (height - pointY) / scale);

    leftTopVisibleCorner = leftTopVisibleCorner.multiply(0.99);
    rightBottomVisibleCorner = rightBottomVisibleCorner.multiply(1.01);

    const visible = [];
    const invisible = [];

    blocks.forEach(b => {
        if (b.position.x >= leftTopVisibleCorner.x && b.position.x <= rightBottomVisibleCorner.x &&
            b.position.y >= leftTopVisibleCorner.y && b.position.y <= rightBottomVisibleCorner.y) {
            visible.push(b);
        }
        else {
            invisible.push(b);
        }
    });

    visible.forEach(b => {
        b.setVisible(scale <= 0.15 ? Visibility.PARTIALLY_VISIBLE : Visibility.VISIBLE);
    });

    invisible.forEach(b => {
        b.setVisible(Visibility.INVISIBLE);
    });
} 