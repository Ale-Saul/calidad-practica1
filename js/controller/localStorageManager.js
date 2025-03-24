define(["model/game"], function (Game) {
    const init = function init() {
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
    

    const load = function load() {
        Game.muteMusic = localStorage.getItem("music") === "true" ? false : true;
        Game.muteSFX = localStorage.getItem("sfx") === "true" ? false : true;
        Game.highscore = parseInt(localStorage.getItem("highscore"));
        Game.scout = parseInt(localStorage.getItem("scout"));
        Game.fighter = parseInt(localStorage.getItem("fighter"));
        Game.interceptor = parseInt(localStorage.getItem("interceptor"));
        Game.tank = parseInt(localStorage.getItem("tank"));
        Game.transport = parseInt(localStorage.getItem("transport"));
    };
    
    const set = function set(k, v) {
        const key = String(k);
        const value = String(v);
        localStorage.setItem(key, value);
    };
    
    const get = function get(k) {
        const key = String(k);
        return localStorage.getItem(key);
    };
    
    const LSM = {
        set,
        get,
        init,
        load
    };
    
    return LSM;    
});