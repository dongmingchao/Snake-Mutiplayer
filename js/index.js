
let game_status         //时钟ID
let status = "off"      //开始/暂停
let game_over_val = 0   //游戏状态 1：进行中  0：ganmeover
let key_status = true   //按键状态
let ss, game

addEventListener("keydown", (e) => {  //监听按键事件
	if (e.keyCode === 32) {
		game_mode()  //执行游戏状态
	}
	if (!key_status) {
		return
	}
	if (e.keyCode == 37 && game_over_val === 1) {
		ss.move.left();
	} else if (e.keyCode == 38 && game_over_val === 1) {
		ss.move.up();
	} else if (e.keyCode == 39 && game_over_val === 1) {
		ss.move.right();
	} else if (e.keyCode == 40 && game_over_val === 1) {
		ss.move.down();
	}
	key_status = false
})
//执行游戏状态
function game_mode() {
	if (status === "off") {
		game = new Game(map)
		ss = new Snake()
		Start_game.style.visibility = "hidden"
		map.style.visibility = "visible"
		status = "on"
		if (game_over_val === 0) {
			init()  //初始化
			game_over_val = 1
		}
		if (!foodNode) append_food()                     //投放食物
		game_status = setInterval(move_direction, game.difficuity.speed)  //开始游戏
	} else {
		key_status = true
		Start_game.style.visibility = "visible"
		map.style.visibility = "hidden"
		status = "off"
		Start_game.children[0].textContent = "游戏暂停中"
		Start_game.children[0].dataset.text = "..."
		clearInterval(game_status)                    //暂停游戏
	}
}



let
	food_coordinate = [],   //食物坐标数组
	foodNode               //食物节点


function init() {  //初始化
	score.children[1].textContent = "0"     //得分
	dir.children[1].textContent = "\u2192" //前进方向文本
	Snak_head.style.top = ss.body.y[0] - 0 + "px"
	Snak_head.style.left = ss.body.x[0] + 0 + "px"
	Snak_head.style.transition = 'all ' + game.difficuity.speed + 'ms linear';
	let node = map.children
	for (let i = node.length - 1; i >= 0; i--) {
		if (node[i].className === "Snak_body") map.removeChild(node[i])
	}
}

function move_direction() {  //移动以及移动过程中的事件判断
	ss.run();
	if (ss.body.x[0] === food_coordinate[0] && ss.body.y[0] === food_coordinate[1]) {
		score.children[1].textContent = score.children[1].textContent - 0 + 1
		ss.eat(...food_coordinate);
		append_food()
	}
	key_status = true
	ss.refresh();
	game_over_judge();
}


function append_food() { //添加食物
	foodNode = document.createElement("span")
	foodNode.className = "food_span"
	let x = parseInt(Math.round(Math.random() * 1000) / 20) * 20
	let [rx, ry] = game.map.range;
	while (ss.body.x.indexOf(x) !== -1 || x > rx)
		x = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
	foodNode.style.left = x + "px"
	let y = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
	while (y > ry) y = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
	foodNode.style.top = y + "px"
	food_coordinate = [x, y];
	map.appendChild(foodNode)
}
/**
 * 碰自己身体
 */
function game_over_judge() {
	// let judge_X = ss.body.x.slice(1), judge_Y = ss.body.y.slice(1)
	// if(judge_X.length === 1) return true;
	// for (let i = 0; i < judge_X.length; i++) {
	// 	if (judge_X[i] === ss.body.x[0]) {
	// 		if (judge_Y[i] === ss.body.y[0]) game_over();
	// 	}
	// }
	// return true
}

function game_over() {   //游戏结束
	Start_game.style.visibility = "visible"
	map.style.visibility = "hidden"
	status = "off"
	key_status = true
	game_over_val = 0
	Start_game.children[0].textContent = "Game over ！！！"
	Start_game.children[0].dataset.text = ""
	clearInterval(game_status)
}