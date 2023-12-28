const State = {
    NONE: 'NONE',
    SELECTING: 'SELECTING',
    BLOCKS_MOVING: 'BLOCKS_MOVING',
    ARROW_MOVING: 'ARROW_MOVING',
    TEMPLATE_SELECTING: 'TEMPLATE_SELECTING',
}

let blocks = [];
let arrows = [];
let scrollable = [];
let arrowToMove;
const blockSize = new Vector2(440, 50)
const startCellSize = new Vector2(25, 25)
let cellSize = new Vector2(25, 25)
let mousePosition = new Vector2(0, 0)
const selectedColor = '#4A87FF';
let scale = 1;
let state = State.NONE;
