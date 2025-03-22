define(["howler"], function (Howler) {
    const bgMusic = new Howl({
        urls: ["./sound/music/DST-DasElectron.mp3"],
        buffer: true,
        loop: true
    });

    const laser1 = new Howl({
        urls: ["./sound/sfx/sfx_laser1.ogg", "./sound/sfx/sfx_laser1.mp3"]
    });

    const explosion = new Howl({
        urls: ["./sound/sfx/explosion.ogg", "./sound/sfx/explosion.mp3"]
    });

    const laser2 = new Howl({
        urls: ["./sound/sfx/sfx_laser2.ogg", "./sound/sfx/sfx_laser2.mp3"]
    });

    const playerHit = new Howl({
        urls: ["./sound/sfx/sfx_shieldDown.ogg", "./sound/sfx/sfx_shieldDown.mp3"]
    });

    const pause = new Howl({
        urls: ["./sound/sfx/pause.wav"]
    });

    const select = new Howl({
        urls: ["./sound/sfx/select.mp3", "./sound/sfx/select.wav"]
    });

    const death = new Howl({
        urls: ["./sound/sfx/death.mp3", "./sound/sfx/death.wav"]
    });

    const levelUp = new Howl({
        urls: ["./sound/sfx/levelUp.mp3", "./sound/sfx/levelUp.wav"]
    });

    const powerUp = new Howl({
        urls: ["./sound/sfx/levelUp.mp3"]
    });

    const Sounds = {
        levelUp,
        powerUp,
        explosion,
        death,
        bgMusic,
        playerHit,
        pause,
        select,
        laser1,
        laser2
    };

    return Sounds;
});