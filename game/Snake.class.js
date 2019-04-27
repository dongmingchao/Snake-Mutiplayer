import game from './index'

class Snake {
    constructor(options) {
        let location;
        if (options) {
            location = options.location;
        }

        this.location = {};
        if (location) this.location.start = location;
        else this.location.start = [0, 320]; //初始蛇头位置
        this.body = {
            x: [this.location.start[0]],
            y: [this.location.start[1]]
        }
        this.location.now = [];

        this.move = this._move;
        this.move.direction = "right";
        this.move.before = this.location.start;
    }
    run() {
        this.move.before = [this.body.x[0], this.body.y[0]];
        if (this.move.direction === "up" && this.body.y[0] - 20 >= 0) {
            this.body.y[0] -= 20
        } else if (this.move.direction === "down" && this.body.y[0] + 20 <= game.map.range[1]) {
            this.body.y[0] += 20
        } else if (this.move.direction === "right" && this.body.x[0] + 20 <= game.map.range[0]) {
            this.body.x[0] += 20
        } else if (this.move.direction === "left" && this.body.x[0] - 20 >= 0) {
            this.body.x[0] -= 20
        } else {
            if(this.ondied instanceof Function) this.ondied();
            return;
        }
    }
    get _move() {
        let left = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "left"
            } else {
                this.move.direction = this.move.direction === "right" ? "right" : "left"
            }
        }
        let right = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "right"
            } else {
                this.move.direction = this.move.direction === "left" ? "left" : "right"
            }
        }
        let up = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "up"
            } else {
                this.move.direction = this.move.direction === "down" ? "down" : "up"
            }
        }
        let down = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "down"
            } else {
                this.move.direction = this.move.direction === "up" ? "up" : "down"
            }
        }
        return { left, right, up, down }
    }
    eat() {
        let [before_move_x, before_move_y] = this.move.before;
        this.body.x.push(before_move_x)
        this.body.y.push(before_move_y)
    }
    refresh() {
        let [before_move_x, before_move_y] = this.move.before;
        for (let i = this.body.x.length - 1; i > 1; i--) {
            this.body.x[i] = this.body.x[i - 1];
            this.body.y[i] = this.body.y[i - 1];
        }
        if (this.body.x.length < 2) return;
        this.body.x[1] = before_move_x;
        this.body.y[1] = before_move_y;
    }
}

export default Snake;