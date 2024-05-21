class EndBlock {
    constructor(block, container) {
        this.state = true;

        this.docElement = document.createElement('div');
        this.docElement.classList.add('chapter-end-block');

        this.p = document.createElement('p');
        this.img = document.createElement('img');
        this.docElement.appendChild(this.p);
        this.docElement.appendChild(this.img);

        this.docElement.onclick = () => {
            this.changeStatus();
        }

        container.appendChild(this.docElement);

        this.block = block;

        this.changeStatus();
        this.updatePosition();
    }

    deleteEndBlock() {
        this.docElement.remove();
        this.docElement = null;
    }

    updatePosition() {
        const height = this.block.docElement.offsetHeight;

        let adjustedPosition = new Vector2(
            Math.round((this.block.position.x + 20) / cellSize.x) * cellSize.x,
            Math.round((this.block.position.y + 50 + height) / cellSize.y) * cellSize.y
        );

        this.docElement.style.left = adjustedPosition.x + "px";
        this.docElement.style.top = adjustedPosition.y + "px";
    }

    changeStatus() {
        this.state = !this.state;

        this.docElement.style.backgroundColor = this.state ? "#254E39" : "#461B24";
        this.docElement.style.borderColor = this.state ? "#4AFF67" : "#FF0000";
        this.p.textContent = this.state ? "End of chapter" : "Dead-end line";
        this.img.src = this.state ? "Images/Icons/good.png" : "Images/Icons/error.png";
    }

    toJSON() {
        return {
            editorId: this.block.editorId,
            state: this.state,
        };
    }
}