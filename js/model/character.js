define(["model/images"], function (Images) {
    const player = {
        name: "player1",
        sprite: Images.playerShip,
        width: 75,
        height: 99,
        frame: 0,
        score: 0,
        damage: 10,
        guns: 1,
        fireRate: 3,
        hasShot: false,
        hp: 100,
        lives: 3,
        pos: {
            x: 40,
            y: 100
        }
    };

    let enemy = {
        scout: {
            name: "scout",
            ship: Images.scout,
            width: 84,
            height: 93,
            hp: 10,
            alive: true,
            damage: 0,
            fireRate: 0,
            hasShot: false,
            score: 100,
            x: 0,
            y: 0,
            time: 0,
            speed: 7
        },
        fighter: {
            name: "fighter",
            ship: Images.fighter,
            width: 84,
            height: 104,
            hp: 30,
            alive: true,
            damage: 10,
            fireRate: 3,
            hasShot: false,
            score: 200,
            x: 100,
            y: 100,
            time: 0,
            speed: 3
        },
        interceptor: {
            name: "interceptor",
            ship: Images.interceptor,
            width: 84,
            height: 103,
            hp: 30,
            alive: true,
            damage: 10,
            fireRate: 4,
            hasShot: false,
            score: 300,
            x: 100,
            y: 100,
            time: 0,
            speed: 2.5
        },
        tank: {
            name: "tank",
            ship: Images.tank,
            width: 84,
            height: 82,
            hp: 60,
            alive: true,
            damage: 0,
            fireRate: 0,
            hasShot: false,
            score: 300,
            x: 100,
            y: 100,
            time: 0,
            speed: 2
        },
        transport: {
            name: "transport",
            ship: Images.transport,
            width: 84,
            height: 97,
            hp: 30,
            alive: true,
            damage: 0,
            fireRate: 0,
            hasShot: false,
            score: 400,
            x: 100,
            y: 100,
            time: 0,
            speed: 3
        }
    };

    var ship = {
        enemy: enemy,
        player: player
    };

    var Character = {
        ship: ship
    };

    return Character;
});