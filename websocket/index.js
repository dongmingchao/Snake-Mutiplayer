let rooms = [];//room name set
let rooms_content = [];
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
                    rooms.push(res);
                    room = {
                        connects: [ws],
                        players: []
                    };
                    room_index = 0;
                    connect_id = 0;
                    rooms_content.push(room)
                }
                ws.on('close', function () {
                    console.log('房间号', room_index, 'player id', connect_id, 'closed');
                })
                ws.send(JSON.stringify({
                    order: 'set players',
                    args: [room.players]
                }));
                ws.on('message', function incoming(message) {
                    let rec = JSON.parse(message);
                    switch (rec.order) {
                        case 'set name': {
                            room.players[connect_id] = rec.args[0];
                            for (let each of room.connects) {
                                each.send(JSON.stringify({
                                    order: 'set players',
                                    args: [room.players]
                                }));
                            }
                            break;
                        }
                        case 'speak': {
                            for (let each of room.connects) {
                                each.send(message);
                            }
                        }
                    }
                });
            }
        }
    });
}