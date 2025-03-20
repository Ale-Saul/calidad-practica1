define(["model/dependencies"], function(deps) {
    var shooting;
    var getMousePos = function getMousePos(evt) {
        deps.Game.keyboard.use = false;
        deps.Game.mouse.use = true;
        var rect = deps.Canvas.canvas.getBoundingClientRect();
        deps.Game.mouse.pos.x = evt.clientX - rect.left;
        deps.Game.mouse.pos.y = evt.clientY - rect.top;
        deps.Character.ship.player.pos.y = deps.Game.mouse.pos.y;
        if (deps.Game.mouse.pos.x <= 0 || deps.Game.mouse.pos.x >= deps.Canvas.canvasWidth || deps.Game.mouse.pos.y <= 0 || deps.Game.mouse.pos.y >= deps.Canvas.canvasHeight) {
            clearInterval(Action.shooting);
        }
    };

    var resize = function resize() {
        deps.Canvas.contextCanvasWidth = window.innerWidth;
        deps.Canvas.contextCanvasHeight = window.innerHeight - 70;
        deps.Canvas.canvasWidth = deps.Canvas.canvas.width;
        deps.Canvas.canvasHeight = deps.Canvas.canvas.height;
        var canvas = document.getElementById("gameCanvas");
        var context = canvas.getContext("2d");
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight - 70;
    };

    var mouseClicked = function mouseClicked(down, kb) {
        deps.Game.keyboard.use = false;
        deps.Game.mouse.use = true;
        switch (deps.Game.screen) {
            case "main_menu":
                if (down && !kb) {
                    Action.mainMenuButtonCheck();
                }
                break;
            case "game":
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
                break;
            case "game_over":
                if (down && !kb) {
                    Action.gameOverButtonCheck();
                }
                break;
            case "options":
                if (down && !kb) {
                    Action.optionsButtonCheck();
                }
                break;
            case "stats":
                if (down && !kb) {
                    Action.statsButtonCheck();
                }
                break;
        }
    };

    var moveShip = function moveShip() {
        if (deps.Game.keyboard.use) {
            if (deps.Game.keyboard.up && deps.Character.ship.player.pos.y >= 10) {
                deps.Character.ship.player.pos.y -= 10;
            } else if (deps.Game.keyboard.down && deps.Character.ship.player.pos.y <= deps.Canvas.canvasHeight - 14) {
                deps.Character.ship.player.pos.y += 10;
            }
        }
    };

    var gameOverButtonCheck = function gameOverButtonCheck() {
        var part1 = deps.Canvas.canvasWidth / 4;
        var part2 = deps.Canvas.canvasHeight / 4;
        var mouseX = deps.Game.mouse.pos.x;
        var mouseY = deps.Game.mouse.pos.y;
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

    var optionsButtonCheck = function optionsButtonCheck() {
        var part1 = deps.Canvas.canvasWidth / 4;
        var part2 = deps.Canvas.canvasHeight / 4;
        var mouseX = deps.Game.mouse.pos.x;
        var mouseY = deps.Game.mouse.pos.y;
        if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.95 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
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
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 && mouseY <= part2 * 1.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.muteSFX = !deps.Game.muteSFX;
            deps.LSM.set("sfx", deps.Game.muteSFX ? "false" : "true");
        }
        if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.85 && mouseY >= part2 * 2 && mouseY <= part2 * 2.7) {
            if (!deps.Game.muteSFX) {
                deps.Sounds.select.play();
            }
            deps.Game.screen = "main_menu";
        }
    };

    var statsButtonCheck = function statsButtonCheck() {
        var part1 = deps.Canvas.canvasWidth / 4;
        var part2 = deps.Canvas.canvasHeight / 4;
        var mouseX = deps.Game.mouse.pos.x;
        var mouseY = deps.Game.mouse.pos.y;
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

    var mainMenuButtonCheck = function mainMenuButtonCheck() {
        var part1 = deps.Canvas.canvasWidth / 4;
        var part2 = deps.Canvas.canvasHeight / 4;
        var mouseX = deps.Game.mouse.pos.x;
        var mouseY = deps.Game.mouse.pos.y;
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

    var enemyShoot = function enemyShoot(x, y, damage) {
        if (!deps.Game.muteSFX) {
            deps.Sounds.laser2.play();
        }
        var bullet = {
            x: x,
            y: y + 52,
            damage: damage,
            alive: true,
            type: deps.Images.redLaser1
        };
        deps.InPlay.enemyBullets.push(bullet);
    };

    var playerShoot = function playerShoot() {
        if (deps.Game.screen !== "game") return;

        var upgrade = deps.Character.ship.player.upgrade;
        if (!deps.Game.muteSFX) {
            deps.Sounds.laser1.play();
        }

        var environmentalFactors = {
            temperature: Math.random() * 30 + 10,
            humidity: Math.random() * 100,
            pressure: Math.random() * 50 + 950
        };

        var calculateBulletAdjustment = function(factors) {
            return (factors.temperature / 100) + (factors.humidity / 1000) - (factors.pressure / 10000);
        };

        var bullet = {
            x: deps.Character.ship.player.pos.x + 60,
            y: deps.Character.ship.player.pos.y - 4,
            alive: true
        };

        bullet.damage = deps.Character.ship.player.damage * (1 + calculateBulletAdjustment(environmentalFactors));
        bullet.type = deps.Images.blueLaser1;

        var bulletTrajectory = [];
        for (var i = 0; i < 5; i++) {
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

    var resetVariables = function resetVariables() {
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

    var Action = {
        moveShip: moveShip,
        shooting: shooting,
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
