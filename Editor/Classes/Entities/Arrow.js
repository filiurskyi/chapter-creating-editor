class Arrow {
    constructor(container, width, startBlock) {
        const arrowPartsLenght = 3;

        this.arrowParts = []

        this.docElement = document.createElement('div')
        this.docElement.style.position = 'absolute'
        this.docElement.style.width = 'auto'
        this.docElement.style.height = 'auto'
        container.appendChild(this.docElement)

        for (let i = 0; i < arrowPartsLenght; i++) {
            let element = document.createElement('div')
            this.arrowParts.push(element)
            this.docElement.appendChild(element)
            element.classList.add('arrow')
        }

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button == 2) {
                this.docElement.remove()
                this.form.form.remove()
            }
        })

        this.width = width
        this.container = container
        this.from = null
        this.to = null

        this.form = new Form(container, arrowTypes, null, 0)
        this.form.form.style.maxWidth = '100px'
        this.form.form.style.width = '100px'
        this.form.form.style.height = '20px'
        this.form.form.style.position = 'absolute'
        this.form.form.style.zIndex = '150'
        this.form.form.style.backgroundColor = '#1c222d'
        this.form.form.style.padding = '10px 10px'

        this.tip = document.createElement('img')
        this.tip.src = 'Images/tip.png'
        this.tip.style.position = 'absolute'
        this.tip.style.zIndex = '150'
        this.tip.style.width = '10px'
        this.tip.style.height = '10px'
        this.docElement.appendChild(this.tip)

        this.startBlock = startBlock
        this.fromId = null
        this.toId = null
        this.fromTop = null
        this.toTop = null
    }

    setFrom(from, id, isTop) {
        this.from = from
        this.fromId = id
        this.fromTop = isTop
    }

    setTo(to, id, isTop) {
        this.to = to
        this.toId = id
        this.toTop = isTop
    }

    placeArrow(mouse) {
        if (this.from == null && this.to == null) return

        var rect = this.container.getBoundingClientRect();
        var rect0;
        var rect1;
        var from
        var to;

        if (this.from == null) {
            from = new Vector2(mouse.x - rect.left, mouse.y - rect.top)
        }
        else {
            rect0 = this.from.getBoundingClientRect();
            from = new Vector2(rect0.left - rect.left + rect0.width / 2, rect0.top - rect.top + rect0.height / 2)
        }

        if (this.to == null) {
            to = new Vector2(mouse.x - rect.left, mouse.y - rect.top)
        }
        else {
            rect1 = this.to.getBoundingClientRect();
            to = new Vector2(rect1.left - rect.left + rect1.width / 2, rect1.top - rect.top + rect1.height / 2)
        }

        this.placeArrowParts(from, to)
    }

    placeArrowParts(from, to) {
        let distance = to.subtract(from)

        if (Math.abs(distance.y) > Math.abs(distance.x)) {
            let semiDistance = distance.y / 2

            if (distance.y < 0)
                this.arrowParts[0].style.top = `${from.y + semiDistance}px`;
            else
                this.arrowParts[0].style.top = `${from.y}px`;
            this.arrowParts[0].style.left = `${from.x}px`;
            this.arrowParts[0].style.height = `${Math.abs(semiDistance)}px`;
            this.arrowParts[0].style.width = `${this.width}px`;

            this.arrowParts[1].style.top = `${from.y + semiDistance}px`;
            if (distance.x > 0) {
                this.arrowParts[1].style.left = `${from.x}px`;
                this.form.form.style.left = `${from.x + (Math.abs(distance.x) / 2) - 50}px`;
            }
            else {
                this.arrowParts[1].style.left = `${from.x + distance.x}px`;
                this.form.form.style.left = `${from.x + distance.x + (Math.abs(distance.x) / 2) - 50}px`;
            }
            this.form.form.style.top = `${from.y + semiDistance - 10}px`

            this.arrowParts[1].style.width = `${Math.abs(distance.x)}px`;
            this.arrowParts[1].style.height = `${this.width}px`;

            if (distance.y < 0)
                this.arrowParts[2].style.top = `${to.y}px`;
            else
                this.arrowParts[2].style.top = `${from.y + semiDistance}px`;
            this.arrowParts[2].style.left = `${to.x}px`;
            this.arrowParts[2].style.height = `${Math.abs(semiDistance)}px`;
            this.arrowParts[2].style.width = `${this.width}px`;
        } else {
            let semiDistance = distance.x / 2

            if (distance.x < 0)
                this.arrowParts[0].style.left = `${from.x + semiDistance}px`;
            else
                this.arrowParts[0].style.left = `${from.x}px`;
            this.arrowParts[0].style.top = `${from.y}px`;
            this.arrowParts[0].style.height = `${this.width}px`;
            this.arrowParts[0].style.width = `${Math.abs(semiDistance)}px`;

            if (distance.y < 0) {
                this.arrowParts[1].style.top = `${from.y + distance.y}px`;
                this.form.form.style.top = `${from.y + distance.y + Math.abs(distance.y) / 2 - 10}px`;
            }
            else {
                this.arrowParts[1].style.top = `${from.y}px`;
                this.form.form.style.top = `${from.y + Math.abs(distance.y) / 2 - 10}px`;
            }
            this.arrowParts[1].style.left = `${from.x + semiDistance}px`;
            this.form.form.style.left = `${from.x + semiDistance - 50}px`;
            this.arrowParts[1].style.width = `${this.width}px`;
            this.arrowParts[1].style.height = `${Math.abs(distance.y)}px`;

            if (distance.x < 0)
                this.arrowParts[2].style.left = `${to.x}px`;
            else
                this.arrowParts[2].style.left = `${to.x - semiDistance}px`;
            this.arrowParts[2].style.top = `${to.y}px`;
            this.arrowParts[2].style.height = `${this.width}px`;
            this.arrowParts[2].style.width = `${Math.abs(semiDistance)}px`;
        }

        this.tip.style.top = `${to.y - 5}px`;
        this.tip.style.left = `${to.x - 5}px`;

        let angle;
        if (Math.abs(distance.y) > Math.abs(distance.x)) {
            angle = distance.y > 0 ? 180 : 0
        } else {
            angle = distance.x > 0 ? 90 : -90
        }

        this.tip.style.transform = `rotate(${angle}deg)`;
    }

    deleteArrow() {
        this.tip.remove()
        this.docElement.remove()
        this.form.form.remove()
    }

    setColor(color) {
        for (let i = 0; i < this.arrowParts.length; i++) {
            this.arrowParts[i].style.backgroundColor = color;
        }
    }

    toJSON() {
        return {
            from: this.fromId,
            to: this.toId,
            fromTop: this.fromTop,
            toTop: this.toTop,
            value: this.form,
        };
    }
}