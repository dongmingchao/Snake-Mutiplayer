import game from '../game'
import Snake from '../game/Snake.class'

let rooms = [];//room name set
let rooms_content = [];

function each_pulse(tent, rt) {
    if (rt === null) return;
    for (let ws of tent.connects) {
        if (ws.readyState === 1)
            ws.send(JSON.stringify(rt))
        else {
            let index = tent.connects.indexOf(ws);
            console.log('closed ws', ws);
        }
    }
}

function placeFood(room) {
    room.food_coordinate = game.create_food(room.snakes);
    each_pulse(room, {
        order: 'set food',
        args: [room.food_coordinate]
    });
}

function join_game(player_name, room_index, ws_id) {
    let room = rooms_content[room_index];
    placeFood(room);
    let snake = new Snake();
    room.snakes[ws_id] = snake;
    snake.ondied = () => {
        each_pulse(room, {
            order: 'died',
            args: [player_name]
        });
        delete room.pulse.do_in_pulse[ws_id];
        room.locations.splice(ws_id, 1);
        room.livings.splice(ws_id, 1);
        room.watchers[ws_id] = player_name;
        if (room.livings.length === 0) room.pulse.context = null;
    }
    each_pulse(room, {
        order: 'set location',
        args: [player_name, snake.location.start]
    });
    room.locations[ws_id] = snake.body;
    room.livings[ws_id] = player_name;
    delete room.watchers[ws_id];
    room.pulse.do_in_pulse[ws_id] = () => {
        snake.run();
        if (snake.body.x[0] === room.food_coordinate[0] && snake.body.y[0] === room.food_coordinate[1]) {
            snake.eat();
            each_pulse(room, {
                order: 'snake grow',
                args: [player_name]
            });
            placeFood(room);
        }
        snake.refresh();
    };
    room.pulse.context = {
        order: 'move',
        args: [room.livings, room.locations]
    }
}

function init_each_ws(room_index, connect_id) {
    let room = rooms_content[room_index];
    let ws = room.connects[connect_id];

    ws.on('close', function () {
        room.connects.splice(connect_id, 1);
        room.players.splice(connect_id, 1);
        room.watchers.splice(connect_id, 1);
        room.livings.splice(connect_id, 1);
        room.locations.splice(connect_id, 1);
        room.locations.splice(connect_id, 1);
        room.pulse.do_in_pulse.splice(connect_id, 1);
        if (room.connects.length === 0) {
            rooms.splice(room_index, 1);
            rooms_content.splice(room_index, 1);
        }
        console.log('房间号', room_index, 'player id', connect_id, 'closed');
    })
    each_pulse(room, {
        order: 'set players',
        args: [room.players]
    });
    ws.send(JSON.stringify({
        order: 'config game',
        args: [game.speed, game.map.range]
    }));
    ws.on('message', function incoming(message) {
        let rec = JSON.parse(message);
        switch (rec.order) {
            case 'set name': {
                room.players[connect_id] = rec.args[0];
                each_pulse(room, {
                    order: 'set players',
                    args: [room.players]
                });
                if (room.snakes[connect_id]) break;
                join_game(rec.args[0], room_index, connect_id);
                break;
            }
            case 'speak': {
                for (let each of room.connects) {
                    each.send(message);
                }
                break;
            }
            case 'set direction': {
                let snake = room.snakes[connect_id];
                snake.move[rec.args[0]]();
                break;
            }
        }
    });
}

export default function (wsc) {
    wsc.on('connection', function connection(ws, req) {
        console.log(req.url);
        if (req.url.startsWith('/room/')) {
            let res = req.url.substr(6);
            if (/^\w+$/.test(res)) {
                let room, room_index, connect_id;
                if (rooms.includes(res)) {
                    //加入房间
                    room_index = rooms.indexOf(res);
                    room = rooms_content[room_index];
                    connect_id = room.connects.length;
                    console.log(res, 'join room', connect_id);
                    room.connects.push(ws);
                } else {
                    //创建房间
                    room_index = rooms.length;
                    connect_id = 0;
                    rooms.push(res);
                    room = {
                        connects: [ws],
                        snakes: [],
                        players: [],
                        watchers: [],
                        livings: [],
                        locations: [],
                        pulse: {
                            do_in_pulse: [],
                            context: null,
                            run() {
                                setInterval(() => {
                                    for (let did of this.do_in_pulse)
                                        if (did instanceof Function) did();
                                    each_pulse(room, this.context);
                                }, game.speed);
                            }
                        }
                    };
                    rooms_content.push(room);
                    room.pulse.run();
                }
                let player_name = 'player' + connect_id;
                room.players.push(player_name);
                room.watchers.push(player_name);
                init_each_ws(room_index, connect_id);
            }
        }
    });
}