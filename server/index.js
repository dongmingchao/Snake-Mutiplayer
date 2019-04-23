/**
 * This File is NOT need to Edit
 * 这个文件不需要被编辑
 */
let app = require("./server").default;
let wsApp = require('../websocket/index').default;

const http = require('http');
const server = http.createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
wsApp(wss);

server.listen(3000);
console.log('Your Server is Running At http://localhost:3000');

if (module.hot) {
    module.hot.accept("./server", () => {
        try {
            server.removeAllListeners("request", server);
            app = require('./server').default;
            server.on("request", app.callback());
        } catch (err) {
            console.log(err);
        }
    });
    module.hot.accept();
    module.hot.dispose(() => {
        server.close()
    })
}