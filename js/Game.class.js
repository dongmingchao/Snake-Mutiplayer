class Game {
    constructor(map) {
        this.map = {
            range: [1240, 440]
        }
        this.difficuity = {
            //游戏难度(时间间隔)
            speed: parseInt(diff.children[1].value)
        }
        this.ui = new UI(this);
    }
}
class UI {
    constructor(game){
        this.game = game;
    }
    start(){
        Start_game.style.visibility = "hidden"
		map.style.visibility = "visible"
    }
    refresh(){
        map.style.width = this.game.map.range[0] + 30 + 'px';
        map.style.height = this.game.map.range[1] + 30 + 'px';
    }
}