class Block {
    constructor(position, size, container, id) {
        this.size = size;
        this.position = position;
        this.id = id

        this.docElement = document.createElement('div');
        this.docElement.id = 'frame';
        this.docElement.classList.add('frame');
        this.docElement.style.width = this.width + 'px';
        this.docElement.style.height = this.height + 'px';
        this.docElement.style.left = (position.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (position.y - this.size.y / 2.0) + 'px';
        container.appendChild(this.docElement);

        this.addButton = document.createElement('button');
        this.addButton.textContent = 'Add';
        this.addButton.classList.add('add-button');
        this.topPoint = document.createElement('div');
        this.topPoint.classList.add('point');
        this.bottomPoint = document.createElement('div');
        this.bottomPoint.classList.add('point');

        this.docElement.appendChild(this.topPoint);
        this.docElement.appendChild(this.addButton);
        this.docElement.appendChild(this.bottomPoint);
        this.form = new Form(this.docElement, frameTypes, this.addButton, -1);
        this.form.form.style.marginBottom = '10px';

        this.formsList = []
        this.arrowsList = []

        this.addButton.addEventListener('click', () => {
            this.formsList.push(new KeyValuePairForm(this.docElement, fieldTypes, this.addButton, this.formsList.length));
            this.updateArrows()
        });

        this.docElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        this.docElement.addEventListener('click', function () {
            blocks.forEach(b => b.docElement.classList.remove('selected'));

            this.classList.add('selected');
        });

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                if (e.target === this.addButton) {
                    return
                }

                if (e.target === this.topPoint ||
                    e.target === this.bottomPoint) {
                    arrowToMove = new Arrow(workplace, 2, this)
                    arrowToMove.setFrom(e.target === this.topPoint ? this.topPoint : this.bottomPoint, this.id, e.target === this.topPoint)
                    return
                }

                blockToMove = this;

            } else if (e.button === 2) {
                this.docElement.remove()
                this.arrowsList.forEach(arrow => {
                    arrows = arrows.filter(item => item !== arrow);
                    arrow.deleteArrow()
                })

                blocks = blocks.filter(item => item !== block);
            }
        })
    }

    placeToMousePosition(delta, cellSize) {
        this.position.x += delta.x
        this.position.y += delta.y

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );

        this.docElement.style.left = adjustedPosition.x + 'px';
        this.docElement.style.top = adjustedPosition.y + 'px';

        this.updateArrows()
    }

    updateArrows() {
        this.arrowsList.forEach(arrow => {
            if (arrow.docElement == null)
                this.arrowsList = this.arrowsList.filter(item => item !== arrow);

            arrow.placeArrow()
        });
    }

    toJSON() {
        return {
            id: this.id,
            header: this.form,
            position: this.position,
            formsList: this.formsList
        };
    }
}