class Game {
    constructor(map) {
        this.map = {
            range: [1240, 440]
        }
        this.difficuity = {
            //游戏难度(时间间隔)
            speed: parseInt(diff.children[1].value)
        }
        map.style.width = this.map.range[0] + 30 + 'px';
        map.style.height = this.map.range[1] + 30 + 'px';
    }
}