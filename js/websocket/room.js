let ws;
let snakes = {};
addEventListener("keydown", (e) => {  //监听按键事件
    // if (e.keyCode === 32) {
    // 	game_mode()  //执行游戏状态
    // }
    // if (!key_status) {
    // 	return
    // }
    if (e.keyCode == 37 && game_over_val === 1) {
        sendDirection('left');
    } else if (e.keyCode == 38 && game_over_val === 1) {
        sendDirection('up');
    } else if (e.keyCode == 39 && game_over_val === 1) {
        sendDirection('right');
    } else if (e.keyCode == 40 && game_over_val === 1) {
        sendDirection('down');
    }
    // key_status = false
})

function sendDirection(direction) {
    let st = {
        order: 'set direction',
        args: [direction]
    }
    ws.send(JSON.stringify(st));
}

function join_room() {
    if (/^\w+$/.test(room_name.value)) {
        if (ws) ws.close();
        ws = new WebSocket('ws://192.168.1.119:3000/room/' + room_name.value);
    } else {
        alert('room name must be a word');
        return;
    }
    ws.onopen = function () {
        console.log('room open');
        game = new Game(map);
        game.ui.start();
    }
    ws.onclose = function () {
        console.log('room close');
    }
    ws.onmessage = function (msg) {
        console.log('message', msg);
        let rec = JSON.parse(msg.data);
        switch (rec.order) {
            case 'set food':
                if (foodNode) {
                    map.removeChild(foodNode);
                    foodNode = null;
                }
                append_food(rec.args[0]);
                break;
            case 'set players':
                players.innerHTML = '';
                for (let each of rec.args[0]) {
                    let li = document.createElement('li');
                    li.innerText = each;
                    players.appendChild(li);
                }
                break;
            case 'set location':
                if (rec.args[0] === my_name.value) game_mode();
                else {
                    let sn = new Snake();
                    sn.id = rec.args[0];
                    snakes[rec.args[0]] = sn;
                    sn.ui.head.classList.replace('snak', 'other_snak');
                }
                break;
            case 'snake grow':
                let sn = snakes[rec.args[0]];
                sn.grow();
                break;
            case 'died':
                let name = rec.args[0];
                if (name === my_name.value) game_over();
                else {
                    snakes[name].remove();
                    delete snakes[name];
                }
                break;
            case 'move':
                for (let i = 0; i < rec.args[0].length; i++) {
                    let name = rec.args[0][i];
                    if (name === null) continue;
                    let sn = snakes[name];
                    if (!sn) {
                        sn = new Snake();
                        sn.id = name;
                        sn.ui.head.classList.replace('snak', 'other_snak');
                        snakes[name] = sn;
                    }
                    sn.moveTo(rec.args[1][i]);
                    sn.refresh();
                }
                break;
            case 'config game':
                game.difficuity.speed = rec.args[0];
                game.map.range = rec.args[1];
                game.ui.refresh();
                break;
            default:
                break;
        }
    }
}
function setName() {
    if (ws && ws.readyState === 1) {
        let st = {
            order: 'set name',
            args: [my_name.value]
        }
        ws.send(JSON.stringify(st));
        if (!ss) {
            game.ui.start();
            ss = new Snake();
            snakes[my_name.value] = ss;
        }
        ss.id = my_name.value;
    }
}
function send_speak() {
    let st = {
        order: 'speak',
        args: [my_name.value + ': ' + speak.value]
    }
    ws.send(JSON.stringify(st));
}