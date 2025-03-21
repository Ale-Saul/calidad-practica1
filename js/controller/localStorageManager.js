define(["model/game"], function (Game) {
    var init = function init() {
        if (typeof (Storage) !== "undefined") {
            const defaultValues = {
                "music": "true",
                "sfx": "true",
                "scout": "0",
                "fighter": "0",
                "interceptor": "0",
                "tank": "0",
                "transport": "0",
                "highscore": "0"
            };
    
            Object.keys(defaultValues).forEach(function(key) {
                if (localStorage.getItem(key) === null) {
                    localStorage.setItem(key, defaultValues[key]);
                }
            });
        } else {
            console.log("nolocalstorage sup"); // TODO
        }
    };
    

    var load = function load() {
        if (localStorage.getItem("music") === "true") {
            Game.muteMusic = false;
        } else {
            Game.muteMusic = true;
        }
        if (localStorage.getItem("sfx") === "true") {
            Game.muteSFX = false;
        } else {
            Game.muteSFX = true;
        }
        Game.highscore = parseInt(localStorage.getItem("highscore"));
        Game.scout = parseInt(localStorage.getItem("scout"));
        Game.fighter = parseInt(localStorage.getItem("fighter"));
        Game.interceptor = parseInt(localStorage.getItem("interceptor"));
        Game.tank = parseInt(localStorage.getItem("tank"));
        Game.transport = parseInt(localStorage.getItem("transport"));
    };

    var set = function set(k, v) {
        var key = String(k);
        var value = String(v);
        localStorage.setItem(key, value);
    };

    var get = function get(k) {
        var key = String(k);
        var value;
        value = localStorage.getItem(key);
        return value;
    };

    var LSM = {
        set: set,
        get: get,
        init: init,
        load: load
    };
    return LSM;
});