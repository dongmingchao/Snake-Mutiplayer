class Snake {
    constructor() {
        this.body = {
            x: [this.location.start[0]],
            y: [this.location.start[1]]
        }
        this.move = this._move;
        this.move.direction = "right";
        this.move.before = this.location.start;

        this.ui = {};
        this.ui.head = document.createElement('div');
        this.ui.head.classList.add('snak', 'head');
        this.ui.head.style.transition = 'all ' + game.difficuity.speed + 'ms linear';
        this.ui.body = [this.ui.head];
        map.appendChild(this.ui.head);
    }
    set id(val) {
        this._id = 'snake_name_' + val;
        this.ui.head.classList.add(this._id);
    }
    location = {
        start: [0, 320]//初始蛇头位置
    }
    length = 1
    // run() {
    //     this.move.before = [this.body.x[0], this.body.y[0]];
    //     if (this.move.direction === "up" && this.body.y[0] - 20 >= 0) {
    //         // Snak_head.style.top = this.body.y[0] - 20 + "px"
    //         this.body.y[0] -= 20
    //     } else if (this.move.direction === "down" && this.body.y[0] + 20 <= game.map.range[1]) {
    //         // Snak_head.style.top = this.body.y[0] + 20 + "px"
    //         this.body.y[0] += 20
    //     } else if (this.move.direction === "right" && this.body.x[0] + 20 <= game.map.range[0]) {
    //         // Snak_head.style.left = this.body.x[0] + 20 + "px"
    //         this.body.x[0] += 20
    //     } else if (this.move.direction === "left" && this.body.x[0] - 20 >= 0) {
    //         // Snak_head.style.left = this.body.x[0] - 20 + "px"
    //         this.body.x[0] -= 20
    //     } else {
    //         game_over()
    //         return
    //     }
    // }
    get _move() {
        let left = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "left"
            } else {
                this.move.direction = this.move.direction === "right" ? "right" : "left"
            }
            if (status === "on") dir.children[1].textContent = this.move.direction === "right" ? "\u2192" : "\u2190"
        }
        let right = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "right"
            } else {
                this.move.direction = this.move.direction === "left" ? "left" : "right"
            }
            if (status === "on") dir.children[1].textContent = this.move.direction === "left" ? "\u2190" : "\u2192"
        }
        let up = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "up"
            } else {
                this.move.direction = this.move.direction === "down" ? "down" : "up"
            }
            if (status === "on") dir.children[1].textContent = this.move.direction === "down" ? "\u2193" : "\u2191"
        }
        let down = () => {
            if (this.body.x.length === 1) {
                this.move.direction = "down"
            } else {
                this.move.direction = this.move.direction === "up" ? "up" : "down"
            }
            if (status === "on") dir.children[1].textContent = this.move.direction === "up" ? "\u2191" : "\u2193"
        }
        return {
            left, right, up, down,
        };
    }
    grow() {
        this.appendBody(this.move.before);
        map.removeChild(foodNode);
        foodNode = null;
    }
    remove() {
        for (let snak of this.ui.body) {
            map.removeChild(snak);
        }
    }
    appendBody(location) {
        let [before_move_x, before_move_y] = location;
        let Snak_body = document.createElement("div")
        Snak_body.classList.add('body', this._id);

        if (ss && this._id === ss._id)
            Snak_body.classList.add('snak');
        else
            Snak_body.classList.add('other_snak');
        Snak_body.style.left = before_move_x + "px"
        Snak_body.style.top = before_move_y + "px"
        Snak_body.style.transition = 'all ' + game.difficuity.speed + 'ms linear';
        this.ui.body.push(Snak_body);
        map.appendChild(Snak_body)
        this.body.x.push(before_move_x)
        this.body.y.push(before_move_y)
    }
    moveTo(body) {
        if (!body) return;
        this.move.before = [this.body.x[0], this.body.y[0]];
        for (let i = this.body.x.length; i < body.x.length; i++) {
            this.appendBody([body.x[i], body.y[i]]);
        }
        this.body = body;
    }
    refresh() {
        this.ui.head.style.left = this.body.x[0] + "px";
        this.ui.head.style.top = this.body.y[0] + "px";
        let last = this.body.x.length - 1;
        let before_move_x = this.body.x[last];
        let before_move_y = this.body.y[last];

        // let snak = map.getElementsByClassName(this._id);
        let snak = this.ui.body;
        for (let i = snak.length - 1; i > 1; i--) {
            snak[i].style.left = this.body.x[i - 1] + "px";
            snak[i].style.top = this.body.y[i - 1] + "px";
            this.body.x[i] = this.body.x[i - 1];
            this.body.y[i] = this.body.y[i - 1];
        }
        if (snak.length < 2) return;
        // if (snak.length === 3) debugger
        snak[1].style.left = before_move_x + "px";
        snak[1].style.top = before_move_y + "px";
        this.body.x[1] = before_move_x;
        this.body.y[1] = before_move_y;
    }
}