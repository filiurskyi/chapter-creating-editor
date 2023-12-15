class Block {
    constructor(position, size, container) {
        this.size = size;
        this.position = position;
        this.id = 0

        this.docElement = document.createElement('div');
        this.docElement.id = 'frame';
        this.docElement.classList.add('frame');
        this.docElement.style.width = this.size.x + 'px';
        this.docElement.style.minHeight = this.size.y + 'px';

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );
        this.docElement.style.left = (adjustedPosition.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (adjustedPosition.y - this.size.y / 2.0) + 'px';
        container.appendChild(this.docElement);

        this.avatarPlaceholder = document.createElement('img');
        this.avatarPlaceholder.src = 'Images/placeholder.png'
        this.avatarPlaceholder.width = "50"
        this.avatarPlaceholder.height = "50"
        this.avatarPlaceholder.style.position = "absolute"
        this.avatarPlaceholder.style.top = "15px"
        this.avatarPlaceholder.style.right = "25px"
        this.avatarPlaceholder.style.cursor = "pointer"
        this.docElement.appendChild(this.avatarPlaceholder);

        this.text = document.createElement('p');
        this.text.textContent = this.id;
        this.text.style.position = "absolute"
        this.text.style.top = "15px"
        this.text.style.left = "25px"
        this.text.style.color = 'white'
        // this.docElement.appendChild(this.text);

        this.addButton = document.createElement('button');
        this.addButton.textContent = '+ Add';
        this.addButton.classList.add('add-button');
        this.topPoint = document.createElement('div');
        this.topPoint.style.position = 'absolute'
        this.topPoint.style.top = '0px'
        this.topPoint.style.left = '50%'
        const point = document.createElement('div');
        point.style.position = 'relative'
        this.bottomPoint = document.createElement('div');
        this.bottomPoint.classList.add('point');

        this.docElement.appendChild(this.topPoint);
        this.docElement.appendChild(this.addButton);
        this.docElement.appendChild(point);
        point.appendChild(this.bottomPoint);
        this.header = new Form(this.docElement, [...frameTypes.keys()], this.addButton, -1, 16, (value) => {
            let color = frameTypes.get(value)
            this.changeColor(color ? color : '#fff')
        });
        this.header.form.style.marginBottom = '10px';
        this.header.form.style.marginLeft = '10px';
        this.header.form.style.maxWidth = '50%';

        this.formsList = []
        this.arrowsList = []

        this.addButton.addEventListener('click', () => {
            this.formsList.push(new KeyValuePairForm(this.docElement, fieldTypes, fieldTypes, this.addButton, this.formsList.length));
            this.updateArrows()
        });

        this.docElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        this.docElement.addEventListener('click', (e) => {
            this.select();
        });

        this.select();

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                if (e.target === this.bottomPoint) {
                    arrowToMove = new Arrow(workplace, this)
                    arrowToMove.setFrom(this.bottomPoint)
                    return
                }

                if (e.target !== this.docElement) return

                blockToMove = this;
            }
        })
    }

    placeToMousePosition(delta) {
        this.position.x += delta.x
        this.position.y += delta.y

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );

        this.docElement.style.left = (adjustedPosition.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (adjustedPosition.y - this.size.y / 2.0) + 'px';

        this.updateArrows()
    }

    updateArrows() {
        this.arrowsList.forEach(arrow => {
            if (arrow.docElement == null)
                this.arrowsList = this.arrowsList.filter(item => item !== arrow);

            arrow.placeArrow()
        });
    }

    changeColor(color) {
        if (this.docElement.classList.contains('selected'))
            color = selectedColor

        this.docElement.style.borderColor = color
        this.header.input.style.borderColor = color
        this.header.input.style.color = color
        this.bottomPoint.style.backgroundColor = color
        for (let i = 0; i < this.arrowsList.length; i++) {
            if (this.arrowsList[i].fromBlock == this) {
                this.arrowsList[i].setColor(color)
            }
        }
    }

    remove() {
        this.docElement.remove()
        this.arrowsList.forEach(arrow => {
            arrows = arrows.filter(item => item !== arrow);
            arrow.deleteArrow()
        })

        blocks = blocks.filter(item => item !== this);
    }

    select() {
        blocks.forEach(b => b.docElement.classList.remove('selected'));

        this.docElement.classList.add('selected');
    }

    toJSON() {
        return {
            id: this.id,
            header: this.header,
            position: this.position,
            formsList: this.formsList
        };
    }
}