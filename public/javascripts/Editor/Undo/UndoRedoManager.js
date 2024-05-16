const undoActions = new Stack();

function addUndoAction(action) {
    undoActions.push(action);
}

function undo() {
    if (undoActions.isEmpty()) return;

    const action = undoActions.pop();
    action();
}