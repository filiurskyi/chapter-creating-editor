module.exports = class Infobase {
    constructor() {
        this.users = new Map();
        this.actions = [];
    }

    addUser(newUserUID) {
        if (this.users.has(newUserUID)) return;

        this.users.set(newUserUID, {
            x: 0,
            y: 0,
            lastRecievedActionID: 0,
        });
    }

    removeUser(userUID) {
        if (this.users.has(userUID) === false) return;

        this.users.delete(userUID);
    }

    addAction(action, userUID) {
        this.actions.push(action);

        let info = this.users.get(userUID);
        info.lastRecievedActionID = this.actions.length;
        this.users.set(userUID, info);
    }

    setUserPosition(userUID, x, y) {
        if (this.users.has(userUID) === false) return;

        let info = this.users.get(userUID);

        info.x = x;
        info.y = y;

        this.users.set(userUID, info);
    }

    getUserPositions(userUID) {
        if (this.users.has(userUID) === false) return;

        let positions = [];
        this.users.forEach((value, key, map) => {
            if (key !== userUID) {
                positions.push({
                    id: key,
                    position: {
                        x: value.x,
                        y: value.y,
                    }
                });
            }
        });

        return positions;
    }

    getActions(userUID) {
        if (this.users.has(userUID) === false) return;

        let actions = [];
        let info = this.users.get(userUID);

        for (let i = info.lastRecievedActionID; i < this.actions.length; i++) {
            actions.push(this.actions[i]);
        }

        info.lastRecievedActionID = this.actions.length;

        this.users.set(userUID, info);

        return actions;
    }

    isEmpty() {
        return this.users.size === 0;
    }
}