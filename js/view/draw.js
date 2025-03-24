define(["model/images", "model/canvas", "model/game", "model/character", "controller/gameLogic", "model/inPlay", "controller/action"],
    function (Images, Canvas, Game, Character, GameLogic, InPlay, Action) {
        const drawStars = function drawStars() {
            let size, x, y;
            for (let i = 0; i < Game.stars.length; i += 1) {
                if (Game.stars[i].x < 0) {
                    Game.stars[i] = Game.generateStar(true);
                }
                size = Game.stars[i].speed / 2;
                x = Game.stars[i].x;
                y = Game.stars[i].y;
                Canvas.context.fillStyle = "rgba(255,255,255,0.5)";
                Canvas.context.fillRect(x, y, size, size);
                Game.stars[i].x -= Game.stars[i].speed;
            }
        };

        const drawBackground = function drawBackground() {
            let mousex = Game.mouse.pos.x;
            let mousey = Game.mouse.pos.Y;
            //Black space
            Canvas.context.fillStyle = "#000000";
            Canvas.context.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
            //Debris/Stars
            drawStars();
        };
        const drawMainMenu = function drawMainMenu() {
            let part1, part2, start, options, stats, help, mouseX, mouseY;
            part1 = Canvas.canvasWidth / 4;
            part2 = Canvas.canvasHeight / 4;
            mouseX = Game.mouse.pos.x;
            mouseY = Game.mouse.pos.y;
            //Button animation
            if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.2 + part1 * 0.75 && mouseY >= part2 && mouseY <= part2 + part2 * 0.7) {
                start = Images.start1;
            } else {
                start = Images.start0;
            }
            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 && mouseY <= part2 + part2 * 0.7) {
                options = Images.options1;
            } else {
                options = Images.options0;
            }
            if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.2 + part1 * 0.75 && mouseY >= part2 * 2 && mouseY <= part2 * 2 + part2 * 0.7) {
                stats = Images.stats1;
            } else {
                stats = Images.stats0;
            }
            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 * 2 && mouseY <= part2 * 2 + part2 * 0.7) {
                help = Images.help1;
            } else {
                help = Images.help0;
            }
            //drawing button
            Canvas.context.drawImage(Images.blueMetal, part1, 0, part1 * 2, part2 * 3.5);
            Canvas.context.drawImage(Images.bigLogo, part1 * 1.1, part2 * 0.1, part1 * 1.8, part2);
            Canvas.context.drawImage(start, part1 * 1.2, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(options, part1 * 2.1, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(stats, part1 * 1.2, part2 * 2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(help, part1 * 2.1, part2 * 2, part1 * 0.75, part2 * 0.7);
        };

        const drawOptions = function drawOptions() {
            let part1, part2, muteMusic, muteSFX, mainMenu;
            part1 = Canvas.canvasWidth / 4;
            part2 = Canvas.canvasHeight / 4;
            let mouseX = Game.mouse.pos.x;
            let mouseY = Game.mouse.pos.y;
            //Button animation
            if (Game.muteMusic) {
                muteMusic = Images.muteMusic1;
            } else {
                muteMusic = Images.muteMusic0;
            }
            if (Game.muteSFX) {
                muteSFX = Images.muteSFX1;
            } else {
                muteSFX = Images.muteSFX0;
            }

            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 * 2 && mouseY <= part2 * 2 + part2 * 0.7) {
                mainMenu = Images.mainMenu1;
            } else {
                mainMenu = Images.mainMenu0;
            }
            //drawing button
            Canvas.context.drawImage(Images.blueMetal, part1, 0, part1 * 2, part2 * 3.5);
            Canvas.context.drawImage(Images.bigLogo, part1 * 1.1, part2 * 0.1, part1 * 1.8, part2);
            Canvas.context.drawImage(muteMusic, part1 * 1.2, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(muteSFX, part1 * 2.1, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(mainMenu, part1 * 2.1, part2 * 2, part1 * 0.75, part2 * 0.7);
        };

        const drawMenu = function drawMenu() {
            switch (Game.screen) {
            case "main_menu":
                Draw.drawMainMenu();
                break;
            case "game_over":
                Draw.drawGameOver();
                break;
            case "options":
                Draw.drawOptions();
                break;
            case "stats":
                Draw.drawStats();
                break;
            case "paused":
                Draw.drawPause();
                break;
            default:
                break;
            }
        };

        const drawPlayerShip = function drawPlayerShip() {
            const player = Character.ship.player;
            let sprite = player.sprite;
            let sx = 0, sy = 0, width = player.width, height = player.height;
            let x = player.pos.x, y = player.pos.y, frame = player.frame;
        
            const getFrameSX = (frame, isExplosion) => {
                if (isExplosion) {
                    const explosionFrames = [0, 192, 384, 576, 768, 960, 0, 192];
                    const explosionFrameIndex = Math.floor(frame);
                    sy = (explosionFrameIndex >= 6) ? 192 : 0;
                    return explosionFrames[explosionFrameIndex];
                } else {
                    return frame * 75;
                }
            };
        
            if (player.hp > 0) {
                Canvas.context.drawImage(Images.gun0, x + 55, y - 8.5);
                sx = getFrameSX(frame, false);
                player.frame = (frame + 1) % 4;
            } else {
                sprite = Images.explosion;
                sx = getFrameSX(frame, true);
                player.frame += 0.2;
            }
        
            Canvas.context.drawImage(sprite, sx, sy, width, height, x, y - height / 2, width, height);
        };
        

        const drawPowerups = function drawPowerups() {
            let powerUps = InPlay.powerUps;
            for (let i = 0; i < powerUps.length; i += 1) {
                if (powerUps[i].alive) {
                    Canvas.context.drawImage(powerUps[i].icon, powerUps[i].x, powerUps[i].y);
                    if (powerUps[i].x <= -10) {
                        powerUps[i].alive = false;
                    } else {
                        powerUps[i].x -= 4;
                    }
                }
            }
        };

        const drawEnemies = function drawEnemies() {
            let relativeTime;
            let enemies = InPlay.enemies;
            let environmentalFactors = {
                windSpeed: Math.random() * 5,
                visibility: Math.random() * 0.5 + 0.5
            };
        
            function calculateEnemyBehavior(enemy, time) {
                var behaviorScore = enemy.speed * time * environmentalFactors.windSpeed;
                return Math.sin(behaviorScore) * 10;
            }
        
            for (let i = 0; i < enemies.length; i += 1) {
                if (enemies[i].alive) {
                    relativeTime = Game.timer - GameLogic.level.startTime;
                    if (relativeTime > enemies[i].time) {
                        var enemyOpacity = Math.max(0.3, Math.min(1, environmentalFactors.visibility));
                        Canvas.context.globalAlpha = enemyOpacity;
                        Canvas.context.drawImage(enemies[i].ship, enemies[i].x, enemies[i].y);
                        Canvas.context.globalAlpha = 1.0;
        
                        if (enemies[i].x <= -140) {
                            enemies[i].alive = false;
                            Character.ship.player.score -= enemies[i].score * 1.4;
                            GameLogic.updateEnemyStatistics(enemies[i].name, 'escaped');
                        } else {
                            var behaviorAdjustment = calculateEnemyBehavior(enemies[i], relativeTime);
                            enemies[i].x -= enemies[i].speed + behaviorAdjustment;
                            
                            if (enemies[i].name === "interceptor") {
                                if (enemies[i].x > Canvas.canvasWidth/2) {
                                    var targetY = Character.ship.player.pos.y - 49.5;
                                    var currentY = enemies[i].y;
                                    var yDiff = targetY - currentY;
                                    enemies[i].y += Math.sign(yDiff) * Math.min(Math.abs(yDiff), 2);
                                }
                            }
                            
                            if (enemies[i].fireRate > 0) {
                                var fireThreshold = Math.min(0.02, enemies[i].fireRate / 100);
                                if ((relativeTime-enemies[i].time) % enemies[i].fireRate <= fireThreshold) {
                                    enemies[i].hasShot = true;
                                    Action.enemyShoot(enemies[i].x, enemies[i].y, enemies[i].damage);
                                    GameLogic.updateEnemyStatistics(enemies[i].name, 'shot_fired');
                                }
                            }
                            
                            GameLogic.checkCollisions(enemies[i]);
                        }
                    }
                }
            }
            
        };
        const drawBullets = function drawBullets() {
            let playerBullets = InPlay.playerBullets;
            let enemyBullets = InPlay.enemyBullets;
            for (let i = 0; i < playerBullets.length; i += 1) {
                if (playerBullets[i].alive) {
                    Canvas.context.drawImage(playerBullets[i].type, playerBullets[i].x, playerBullets[i].y);
                    if (playerBullets[i].x >= Canvas.canvasWidth) {
                        playerBullets.shift();
                    } else {
                        playerBullets[i].x += 40;
                    }
                }
            }
            for (i = 0; i < enemyBullets.length; i += 1) {
                if (enemyBullets[i].alive) {
                    Canvas.context.drawImage(enemyBullets[i].type, enemyBullets[i].x, enemyBullets[i].y);
                    if (enemyBullets[i].x <= 0) {
                        enemyBullets.shift();
                    } else {
                        enemyBullets[i].x -= 10;
                    }
                }
            }
        };

        const drawScore = function drawScore() {
            let score = Character.ship.player.score;
            Canvas.context.fillStyle = ("yellow");
            Canvas.context.fillText("Score: " + score, Canvas.canvasWidth * 0.6, 40);
        };

        const drawHP = function drawHP() {
            let hp = Character.ship.player.hp;
            Canvas.context.fillStyle = ("yellow");
            Canvas.context.fillText("Health: " + hp, 0, 40);
        };

        const drawGameOver = function drawGameOver() {
            var restart, mainMenu;
            let part1 = Canvas.canvasWidth / 4;
            let part2 = Canvas.canvasHeight / 4;
            let mouseX = Game.mouse.pos.x;
            let mouseY = Game.mouse.pos.y;
            if (mouseX >= part1 * 1.2 && mouseX <= part1 * 1.2 + part1 * 0.75 && mouseY >= part2 && mouseY <= part2 + part2 * 0.7) {
                restart = Images.restart1;
            } else {
                restart = Images.restart0;
            }
            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 && mouseY <= part2 + part2 * 0.7) {
                mainMenu = Images.mainMenu1;
            } else {
                mainMenu = Images.mainMenu0;
            }
			Draw.drawPlayerShip();
            Canvas.context.drawImage(Images.blueMetal, part1, 0, part1 * 2, part2 * 2);
            Canvas.context.drawImage(Images.bigLogo, part1 * 1.1, part2 * 0.1, part1 * 1.8, part2);
            Canvas.context.drawImage(restart, part1 * 1.2, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(mainMenu, part1 * 2.1, part2, part1 * 0.75, part2 * 0.7);
            if (Game.isHighscore) {
                Canvas.context.fillStyle = ("yellow");
                Canvas.context.fillText("HIGH SCORE", (Canvas.canvasWidth / 2) - 108, Canvas.canvasHeight / 1.7);
            }
            Canvas.context.fillStyle = ("yellow");
            Canvas.context.fillText("Game Over  Level: " + Game.level + "  Score: " + Character.ship.player.score, (Canvas.canvasWidth / 2) - 345, Canvas.canvasHeight / 1.5);
        };

        const drawStats = function drawStats() {
            var part1, part2, mainMenu, resetStats, mouseX, mouseY;
            part1 = Canvas.canvasWidth / 4;
            part2 = Canvas.canvasHeight / 4;
            mouseX = Game.mouse.pos.x;
            mouseY = Game.mouse.pos.y;
            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 && mouseY <= part2 + part2 * 0.7) {
                mainMenu = Images.mainMenu1;
            } else {
                mainMenu = Images.mainMenu0;
            }
            if (mouseX >= part1 * 2.1 && mouseX <= part1 * 2.1 + part1 * 0.75 && mouseY >= part2 * 2 && mouseY <= part2 * 2 + part2 * 0.7) {
                resetStats = Images.resetStats1;
            } else {
                resetStats = Images.resetStats0;
            }
            Canvas.context.drawImage(Images.blueMetal, part1, 0, part1 * 2, part2 * 3.5);
            Canvas.context.fillStyle = 'rgba(0,0,0,0.5)';
            Canvas.context.fillRect(part1, 0, part1 * 2, part2 * 3.5);
            Canvas.context.fillStyle = 'yellow';
            Canvas.context.drawImage(mainMenu, part1 * 2.1, part2, part1 * 0.75, part2 * 0.7);
            Canvas.context.drawImage(resetStats, part1 * 2.1, part2 * 2, part1 * 0.75, part2 * 0.7);
            Canvas.context.fillText("Highscore: " + Game.highscore, part1 * 1.1, part2 * 0.5);
            Canvas.context.fillText("Enemies killed", part1 * 1.1, part2);
            Canvas.context.fillText("Scout: " + Game.scout, part1 * 1.1, part2 * 1.40);
            Canvas.context.fillText("Fighter: " + Game.fighter, part1 * 1.1, part2 * 1.70);
            Canvas.context.fillText("Interceptor: " + Game.interceptor, part1 * 1.1, part2 * 2);
            Canvas.context.fillText("Tank: " + Game.tank, part1 * 1.1, part2 * 2.30);
            Canvas.context.fillText("Transporter: " + Game.transport, part1 * 1.1, part2 * 2.60);
        };

        const drawPause = function drawPause() {
            Canvas.context.drawImage(Images.pauseScreen, 0, 0, Canvas.canvasWidth, Canvas.canvasHeight);
        };

        const drawGame = function drawGame() {
            if (Game.levelStarted) {
                Draw.drawScore();
                Draw.drawHP();
            } else {
                Canvas.context.fillStyle = ("yellow");
                Canvas.context.fillText("Level: " + Game.level, (Canvas.canvasWidth / 2) - 80, Canvas.canvasHeight / 2);
            }
            Draw.drawBullets();
            Draw.drawPlayerShip();
            Draw.drawEnemies();
            Draw.drawPowerups();
        };

        const Draw = {
            //functions

            drawStars: drawStars,
            drawBackground: drawBackground,
            drawHP: drawHP,
            drawScore: drawScore,
            drawPlayerShip: drawPlayerShip,
            drawEnemies: drawEnemies,
            drawPowerups: drawPowerups,
            drawBullets: drawBullets,
            drawGame: drawGame,
            drawMainMenu: drawMainMenu,
            drawOptions: drawOptions,
            drawMenu: drawMenu,
            drawStats: drawStats,
            drawPause: drawPause,
            drawGameOver: drawGameOver
        };

        return Draw;
    });