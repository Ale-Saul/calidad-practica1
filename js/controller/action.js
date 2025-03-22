define(["model/dependencies"], function(deps) {
    const getMousePos = function getMousePos(evt) {
        deps.Game.keyboard.use = false;
        deps.Game.mouse.use = true;
        const rect = deps.Canvas.canvas.getBoundingClientRect();
        deps.Game.mouse.pos.x = evt.clientX - rect.left;
        deps.Game.mouse.pos.y = evt.clientY - rect.top;
        deps.Character.ship.player.pos.y = deps.Game.mouse.pos.y;
        if (deps.Game.mouse.pos.x <= 0 || deps.Game.mouse.pos.x >= deps.Canvas.canvasWidth || deps.Game.mouse.pos.y <= 0 || deps.Game.mouse.pos.y >= deps.Canvas.canvasHeight) {
            clearInterval(Action.shooting);
        }
    };

    const resize = function resize() {
        deps.Canvas.contextCanvasWidth = window.innerWidth;
        deps.Canvas.contextCanvasHeight = window.innerHeight - 70;
        deps.Canvas.canvasWidth = deps.Canvas.canvas.width;
        deps.Canvas.canvasHeight = deps.Canvas.canvas.height;
        const canvas = document.getElementById("gameCanvas");
        const context = canvas.getContext("2d");
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight - 70;
    };

    const handleSimpleClick = function(down, kb, callback) {
        if (down && !kb) {
            callback();
        }
    };
    
    const handleGameClick = function(down) {
        if (down && !deps.Game.keyboard.sbFlag) {
            deps.Game.keyboard.sbFlag = true;
            Action.shooting = setInterval(function () {
                if (deps.Character.ship.player.hp > 0) {
                    Action.playerShoot();
                }
            }, 100);
        } else if (!down) {
            clearInterval(Action.shooting);
            deps.Game.keyboard.sbFlag = false;
        }
    };

    const mouseClicked = function mouseClicked(down, kb) {
    deps.Game.keyboard.use = false;
    deps.Game.mouse.use = true;

    switch (deps.Game.screen) {
        case "main_menu":
            handleSimpleClick(down, kb, Action.mainMenuButtonCheck);
            break;
        case "game":
            handleGameClick(down);
            break;
        case "game_over":
            handleSimpleClick(down, kb, Action.gameOverButtonCheck);
            break;
        case "options":
            handleSimpleClick(down, kb, Action.optionsButtonCheck);
            break;
        case "stats":
            handleSimpleClick(down, kb, Action.statsButtonCheck);
            break;
    }
};
    const moveShip = function moveShip() {
        if (deps.Game.keyboard.use) {
            if (deps.Game.keyboard.up && deps.Character.ship.player.pos.y >= 10) {
                deps.Character.ship.player.pos.y -= 10;
            } else if (deps.Game.keyboard.down && deps.Character.ship.player.pos.y <= deps.Canvas.canvasHeight - 14) {
                deps.Character.ship.player.pos.y += 10;
            }
        }
    };

    const gameOverButtonCheck = function gameOverButtonCheck() {
        const part1 = deps.Canvas.canvasWidth / 4;
        const part2 = deps.Canvas.canvasHeight / 4;
        const mouseX = deps.Game.mouse.pos.x;
        const mouseY = deps.Game.mouse.pos.y;
        if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.95 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            Action.resetVariables();
            deps.Game.screen = "game";
            deps.GameLogic.level.start();
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "main_menu";
        }
    };
    
    const toggleMusic = function() {
        if (!deps.Game.muteSFX) deps.Sounds.select.play();
    
        if (deps.Game.muteMusic === false) {
            deps.Game.muteMusic = true;
            deps.LSM.set("music", "false");
            deps.Sounds.bgMusic.mute();
        } else {
            if (!deps.Game.musicCreated) {
                deps.Sounds.bgMusic.play();
                deps.Game.musicCreated = true;
            }
            deps.Sounds.bgMusic.unmute();
            deps.Game.muteMusic = false;
            deps.LSM.set("music", "true");
        }
    };
    
    const toggleSFX = function() {
        if (!deps.Game.muteSFX) deps.Sounds.select.play();
    
        deps.Game.muteSFX = !deps.Game.muteSFX;
        deps.LSM.set("sfx", deps.Game.muteSFX ? "false" : "true");
    };
    
    const returnToMainMenu = function() {
        if (!deps.Game.muteSFX) deps.Sounds.select.play();
        deps.Game.screen = "main_menu";
    };

    const isInside = function(mouseX, mouseY, x1, x2, y1, y2) {
        return mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2;
    };
    
    const optionsButtonCheck = function optionsButtonCheck() {
        const part1 = deps.Canvas.canvasWidth / 4;
        const part2 = deps.Canvas.canvasHeight / 4;
        const mouseX = deps.Game.mouse.pos.x;
        const mouseY = deps.Game.mouse.pos.y;
    
        if (isInside(mouseX, mouseY, part1 * 1.2, part1 * 1.95, part2, part2 * 1.7)) {
            toggleMusic();
        }
    
        if (isInside(mouseX, mouseY, part1 * 2.1, part1 * 2.85, part2, part2 * 1.7)) {
            toggleSFX();
        }
    
        if (isInside(mouseX, mouseY, part1 * 2.1, part1 * 2.85, part2 * 2, part2 * 2.7)) {
            returnToMainMenu();
        }
    };
    

    const statsButtonCheck = function statsButtonCheck() {
        const part1 = deps.Canvas.canvasWidth / 4;
        const part2 = deps.Canvas.canvasHeight / 4;
        const mouseX = deps.Game.mouse.pos.x;
        const mouseY = deps.Game.mouse.pos.y;
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "main_menu";
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 * 2 && mouseY <= part2 * 2.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.GameLogic.resetStats();
        }
    };

    const mainMenuButtonCheck = function mainMenuButtonCheck() {
        const part1 = deps.Canvas.canvasWidth / 4;
        const part2 = deps.Canvas.canvasHeight / 4;
        const mouseX = deps.Game.mouse.pos.x;
        const mouseY = deps.Game.mouse.pos.y;
        if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.95 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "game";
            Action.resetVariables();
            deps.GameLogic.level.start();
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "options";
        }
        if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.95 && mouseY >= part2 * 2 && mouseY <= part2 * 2.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "stats";
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 * 2 && mouseY <= part2 * 2.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "paused";
            deps.Game.paused = true;
        }
    };

    const enemyShoot = function enemyShoot(x, y, damage) {
        if (!deps.Game.muteSFX) {
            deps.Sounds.laser2.play();
        }
        const bullet = {
            x: x,
            y: y + 52,
            damage: damage,
            alive: true,
            type: deps.Images.redLaser1
        };
        deps.InPlay.enemyBullets.push(bullet);
    };

    const playerShoot = function playerShoot() {
        if (deps.Game.screen !== "game") return;

        const upgrade = deps.Character.ship.player.upgrade;
        if (!deps.Game.muteSFX) {
            deps.Sounds.laser1.play();
        }

        const environmentalFactors = {
            temperature: Math.random() * 30 + 10,
            humidity: Math.random() * 100,
            pressure: Math.random() * 50 + 950
        };

        const calculateBulletAdjustment = function(factors) {
            return (factors.temperature / 100) + (factors.humidity / 1000) - (factors.pressure / 10000);
        };

        const bullet = {
            x: deps.Character.ship.player.pos.x + 60,
            y: deps.Character.ship.player.pos.y - 4,
            alive: true
        };

        bullet.damage = deps.Character.ship.player.damage * (1 + calculateBulletAdjustment(environmentalFactors));
        bullet.type = deps.Images.blueLaser1;

        const bulletTrajectory = [];
        for (let i = 0; i < 5; i++) {
            bulletTrajectory.push({
                x: bullet.x + (i * 20),
                y: bullet.y - (i * 0.5)
            });
        }

        bullet.metadata = {
            firedAt: new Date().getTime(),
            playerEnergy: deps.Character.ship.player.energy || 100,
            trajectory: bulletTrajectory
        };

        deps.InPlay.playerBullets.push(bullet);
    };

    const resetVariables = function resetVariables() {
        deps.Game.gameOver = false;
        deps.Game.timer = 0;
        deps.Game.level = 1;
        deps.Game.levelStarted = false;

        deps.InPlay.enemies.length = 0;
        deps.InPlay.enemyBullets.length = 0;
        deps.InPlay.powerUps.length = 0;

        deps.Character.ship.player.score = 0;
        deps.Character.ship.player.hp = 100;
        deps.Character.ship.player.guns = 1;
        deps.Character.ship.player.damage = 10;
        deps.Character.ship.player.fireRate = 3;
    };

    const Action = {
        moveShip: moveShip,
        shooting: null,
        mouseClicked: mouseClicked,
        playerShoot: playerShoot,
        enemyShoot: enemyShoot,
        resetVariables: resetVariables,
        mainMenuButtonCheck: mainMenuButtonCheck,
        optionsButtonCheck: optionsButtonCheck,
        gameOverButtonCheck: gameOverButtonCheck,
        statsButtonCheck: statsButtonCheck,
        getMousePos: getMousePos,
        resize: resize
    };

    return Action;
});
