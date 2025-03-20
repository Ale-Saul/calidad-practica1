define(["model/game", "model/character", "model/inPlay", "model/canvas", "model/sounds", "model/images", "controller/localStorageManager"], function (Game, Character, InPlay, Canvas, Sounds, Images, LSM) {
    let timerInterval;
    const resetTimer = function resetTimer() {
        Game.timer = 0;
    };

    const clone = (function () {
        return function (obj) {
            Clone.prototype = obj;
            return new Clone();
        };
    })();

    const startTimer = () => {
        timerInterval = setInterval(() => {
            if (Game.levelStarted) {
                Game.timer += 0.01;
                GameLogic.addScore(2);
            }
        }, 10);
    };
    

    const addScore = function addScore(add) {
        Character.ship.player.score += add;
    };

    const stopTimer = function stopTimer() {
        clearInterval(timerInterval);
    };

    const getTimer = function getTimer() {
        return Game.timer;
    };

    const timer = {
        reset: resetTimer,
        start: startTimer,
        stop: stopTimer,
        get: getTimer
    };

    const startLevel = function startLevel() {
        setTimeout(function () {
            if (!Game.muteSFX) {
                Sounds.levelUp.play();
            }
            Game.levelStarted = true;
            GameLogic.timer.start();
            GameLogic.addEnemies();
        }, 3000);
    };

    const checkEnemiesDead = function checkEnemiesDead() {
        let alive = 0;
        const enemies = InPlay.enemies;
        let i;
        if (enemies.length > 0 && !Game.gameOver) {
            for (i = 0; i < enemies.length; i++) {
                if (enemies[i].alive) {
                    alive++;
                }
            }
            if (alive === 0) {
                GameLogic.timer.stop();
                enemies.length = 0;
                Game.level++;
                Game.levelStarted = false;
                GameLogic.level.start();
            }
        }
    };

    const checkBulletCollision = () => {
        const playerPos = Character.ship.player.pos;
        const playerBullets = InPlay.playerBullets;
        const enemyBullets = InPlay.enemyBullets;
        const enemies = InPlay.enemies;
    
        playerBullets.forEach(bullet => {
            if (bullet.alive) {
                enemies.forEach(enemy => {
                    if (enemy.alive && checkCollision(bullet, enemy)) {
                        handlePlayerBulletHit(bullet, enemy);
                    }
                });
            }
        });
    
        enemyBullets.forEach(bullet => {
            if (bullet.alive && checkPlayerBulletHit(bullet, playerPos)) {
                handleEnemyBulletHit(bullet);
            }
        });
    };
    
    const checkCollision = (bullet, enemy) => {
        return bullet.x >= enemy.x && bullet.x <= enemy.x + enemy.width &&
               bullet.y >= (enemy.y - 9) && bullet.y <= enemy.y + enemy.height;
    };
    
    const handlePlayerBulletHit = (bullet, enemy) => {
        bullet.alive = false;
        enemy.hp -= bullet.damage;
    
        if (enemy.hp <= 0) {
            if (!Game.muteSFX) {
                Sounds.death.play();
            }
            enemy.alive = false;
            GameLogic.addScore(enemy.score);
            handleEnemyType(enemy);
        }
    };
    
    const handleEnemyType = (enemy) => {
        switch (enemy.name) {
            case "transport":
                GameLogic.dropPickUp(enemy.x, enemy.y);
                Game.transport += 1;
                break;
            case "scout":
                Game.scout += 1;
                break;
            case "fighter":
                Game.fighter += 1;
                break;
            case "interceptor":
                Game.interceptor += 1;
                break;
            case "tank":
                Game.tank += 1;
                break;
        }
    };
    
    const checkPlayerBulletHit = (bullet, playerPos) => {
        return bullet.x >= playerPos.x - 13 && bullet.x <= playerPos.x + Character.ship.player.width &&
               bullet.y >= playerPos.y - Character.ship.player.height / 2 && bullet.y <= playerPos.y + Character.ship.player.height / 2;
    };
    
    const handleEnemyBulletHit = (bullet) => {
        if (!Game.muteSFX) {
            Sounds.playerHit.play();
        }
        bullet.alive = false;
        Character.ship.player.hp -= bullet.damage;
    
        if (Character.ship.player.hp <= 0) {
            if (!Game.muteSFX) {
                Sounds.explosion.play();
            }
            GameLogic.gameOver();
        }
    };
    

    const dropPickUp = function dropPickUp(x, y) {
        const selector = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        const pickUp = {
            x: x,
            y: y + 45,
            alive: true
        };
        if (selector === 1) {
            pickUp.type = "health";
            pickUp.icon = Images.pickUpHealth;
        } else if (selector === 2) {
            pickUp.type = "fireRate";
            pickUp.icon = Images.pickUpFireRate;
        } else if (selector === 3) {
            pickUp.type = "damage";
            pickUp.icon = Images.pickUpDamage;
        }
        InPlay.powerUps.push(pickUp);
    };

    const checkPickUp = () => {
        const powerUps = InPlay.powerUps;
        const player = Character.ship.player;
    
        powerUps.forEach(powerUp => {
            if (powerUp.alive && isCollidingWithPlayer(powerUp, player)) {
                if (!Game.muteSFX) {
                    Sounds.powerUp.play();
                }
    
                applyPowerUp(powerUp, player);
                powerUp.alive = false;
            }
        });
    };
    
    const isCollidingWithPlayer = (powerUp, player) => {
        return powerUp.x >= player.pos.x && powerUp.x <= (player.pos.x + player.width) &&
               powerUp.y >= (player.pos.y - player.height) && powerUp.y <= player.pos.y + player.height / 2;
    };
    
    const applyPowerUp = (powerUp, player) => {
        const powerUpActions = {
            health: () => player.hp += 20,
            fireRate: () => {
                player.fireRate -= 0.09;
                GameLogic.fRate = true;
            },
            damage: () => player.damage += 1
        };
    
        if (powerUpActions[powerUp.type]) {
            powerUpActions[powerUp.type]();
        }
    };
    

    const checkShipCollision = () => {
        const player = Character.ship.player;
        const playerPos = player.pos;
    
        InPlay.enemies.forEach(enemy => {
            if (enemy.alive && player.hp > 0 && isColliding(playerPos, player, enemy)) {
                handleCollision(enemy, player);
            }
        });
    };
    
    const isColliding = (playerPos, player, enemy) => {
        const isXColliding = (enemy.x >= playerPos.x && enemy.x <= playerPos.x + player.width) || 
                             (enemy.x + enemy.width >= playerPos.x && enemy.x + enemy.width <= playerPos.x + player.width);
        const isYColliding = (enemy.y >= playerPos.y - player.height && enemy.y <= playerPos.y + player.height / 2) ||
                             (playerPos.y - player.height / 2 >= enemy.y && playerPos.y - player.height / 2 <= enemy.y + enemy.height);
    
        return isXColliding && isYColliding;
    };
    
    const handleCollision = (enemy, player) => {
        if (!Game.muteSFX) {
            Sounds.playerHit.play();
            Sounds.death.play();
        }
    
        enemy.alive = false;
        player.hp -= enemy.hp;
    
        if (player.hp <= 0) {
            if (!Game.muteSFX) {
                Sounds.explosion.play();
            }
            GameLogic.gameOver();
        }
    };
    

    var gameOver = function gameOver() {
        var isHighscore = false;
        var enemies = InPlay.enemies;
        GameLogic.timer.stop();
        enemies.length = 0;
        Game.levelStarted = false;
        Game.gameOver = true;
        if (Game.highscore < Character.ship.player.score) {
            isHighscore = true;
            Game.highscore = Character.ship.player.score;
        }
        GameLogic.uploadStats(isHighscore);
        Game.screen = "game_over";
    };

    var uploadStats = function uploadStats(isHighscore) {
        if (isHighscore) {
            LSM.set("highscore", Game.highscore);
            Game.isHighscore = true;
        } else {
            Game.isHighscore = false;
        }
        LSM.set("scout", Game.scout);
        LSM.set("fighter", Game.fighter);
        LSM.set("interceptor", Game.interceptor);
        LSM.set("tank", Game.tank);
        LSM.set("transport", Game.transport);
    };

    var resetStats = function resetStats() {
        Game.highscore = 0;
        Game.scout = 0;
        Game.fighter = 0;
        Game.interceptor = 0;
        Game.tank = 0;
        Game.transport = 0;
        LSM.set("highscore", 0);
        LSM.set("scout", 0);
        LSM.set("fighter", 0);
        LSM.set("interceptor", 0);
        LSM.set("tank", 0);
        LSM.set("transport", 0);
    };

    var checkCollisions = function checkCollisions() {
        GameLogic.checkShipCollision();
        GameLogic.checkBulletCollision();
        GameLogic.checkEnemiesDead();
        GameLogic.checkPickUp();
    };

    var spawnCheck = function spawnCheck(newShip, spawnTime) {
        var i, enemies, spawningY, verdict, time;
        verdict = true;
        time = spawnTime;
        spawningY = newShip;
        enemies = InPlay.enemies;
        if (enemies.length >= 1) {
            for (i = 0; i < enemies.length; i++) {
                if (time < enemies[i].time + 1) {
                    if (spawningY > enemies[i].y - 104 && spawningY < enemies[i].y + 104) {
                        verdict = false;
                    }
                }
            }
        }
        return verdict;
    };

    var addEnemies = function addEnemies() {
        var i, enemy, x, y, noEnemies, rate, selector, lvlSelector;
        noEnemies = Game.level * 5;
        if (Game.level <= 5) {
            lvlSelector = Game.level;
        } else {
            lvlSelector = 5;
        }
        if (Game.level < 6) {
            rate = 1;
        } else {
            rate = 0.5;
        }
        var time = 0;
        GameLogic.level.startTime = Game.timer;
        var enemiesAdded = 0;
        while (enemiesAdded < noEnemies) {
            selector = Math.floor(Math.random() * (lvlSelector - 1 + 1) + 1);
            if (selector === 1) {
                enemy = GameLogic.clone(Character.ship.enemy.scout);
            } else if (selector === 2) {
                enemy = GameLogic.clone(Character.ship.enemy.fighter);
            } else if (selector === 3) {
                if (Game.level % 3 === 0) {
                    enemy = GameLogic.clone(Character.ship.enemy.transport);
                } else {
                    enemy = GameLogic.clone(Character.ship.enemy.scout);
                }
            } else if (selector === 4) {
                enemy = GameLogic.clone(Character.ship.enemy.tank);
            } else if (selector === 5) {
                enemy = GameLogic.clone(Character.ship.enemy.interceptor);
            }
            y = Math.floor(Math.random() * (Canvas.canvasHeight - 90)) + 1;
            if (GameLogic.spawnCheck(y, time)) {
                x = Canvas.canvasWidth + 100;
                enemy.y = y;
                enemy.x = x;
                enemy.hp += Game.level * (Math.floor(Game.level / 2) - 1);
                enemy.time = time;
                time += rate;
                InPlay.enemies.push(enemy);
                enemiesAdded++;
            }
        }
    };

    var level = {
        //functions
        start: startLevel,
        //variables
        startTime: 0
    };

    var GameLogic = {
        //functions
        clone: clone,
        spawnCheck: spawnCheck,
        addEnemies: addEnemies,
        checkBulletCollision: checkBulletCollision,
        checkShipCollision: checkShipCollision,
        checkPickUp: checkPickUp,
        checkCollisions: checkCollisions,
        checkEnemiesDead: checkEnemiesDead,
        dropPickUp: dropPickUp,
        addScore: addScore,
        gameOver: gameOver,
        uploadStats: uploadStats,
        resetStats: resetStats,
        //variables
        paused: false,
	fRate: false,
        level: level,
        timer: timer
    };
    return GameLogic;
});
