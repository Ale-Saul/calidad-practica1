define(["model/game", "model/character", "model/inPlay", "controller/gameLogic", "controller/localStorageManager", "model/resources"],
    function (Game, Character, InPlay, GameLogic, LSM, Resources) {
        var shooting;
        var getMousePos = function getMousePos(evt) {
            Game.keyboard.use = false;
            Game.mouse.use = true;
            var rect = Resources.canvas.canvas.getBoundingClientRect();
            Game.mouse.pos.x = evt.clientX - rect.left;
            Game.mouse.pos.y = evt.clientY - rect.top;
            Character.ship.player.pos.y = Game.mouse.pos.y;
            if (Game.mouse.pos.x <= 0 || Game.mouse.pos.x >= Resources.canvas.canvasWidth || Game.mouse.pos.y <= 0 || Game.mouse.pos.y >= Resources.canvas.canvasHeight) {
                clearInterval(Action.shooting);
            }
        };

        var resize = function resize() {
            Resources.canvas.contextCanvasWidth = window.innerWidth;
            Resources.canvas.contextCanvasHeight = window.innerHeight - 70;
            Resources.canvas.canvasWidth = Resources.canvas.canvas.width;
            Resources.canvas.canvasHeight = Resources.canvas.canvas.height;
            canvas = document.getElementById("gameCanvas");
            context = canvas.getContext("2d");
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight - 70;
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
        };

        // ... existing code ...

        // Modificar todas las referencias a Canvas, Images y Sounds
        // Por ejemplo:
        // Canvas.canvasWidth -> Resources.canvas.canvasWidth
        // Images.blueLaser1 -> Resources.images.blueLaser1
        // Sounds.select.play() -> Resources.sounds.select.play()

        // ... existing code ...

        var enemyShoot = function enemyShoot(x, y, damage) {
            // ... existing code ...
            
            if (!Game.muteSFX) {
                Resources.sounds.laser2.play();
            }
            bullet = {
                x: tempX,
                y: tempY + 52,
                damage: tempDamage,
                alive: true,
                type: Resources.images.redLaser1
            };
            InPlay.enemyBullets.push(bullet);
        };

        var playerShoot = function playerShoot() {
            // ... existing code ...
            
            if (!Game.muteSFX) {
                Resources.sounds.laser1.play();
            }
            
            // ... existing code ...
            
            tempType = Resources.images.blueLaser1;
            
            // ... existing code ...
        };

        // Continúa las modificaciones para todas las referencias...

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