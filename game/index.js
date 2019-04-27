export default {
    speed: 300,
    map: {
        range: [1040, 440]
    },
    game_over() {
        console.log('Game Over');
    },
    create_food(snakes) {
        snakes = snakes.filter(e => e);
        let x = parseInt(Math.round(Math.random() * 1000) / 20) * 20
        let [rx, ry] = this.map.range;
        let xs = [];
        for (let ss of snakes) {
            for (let each_x of ss.body.x)
                if (xs.includes(each_x)) continue;
                else xs.push(each_x);
        }
        while (xs.indexOf(x) !== -1 || x > rx)
            x = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
        let y = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
        while (y > ry) y = parseInt(Math.round(Math.random() * 1000) / 20) * 20;
        return [x, y];
    }
}