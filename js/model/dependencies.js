define([
    "model/game",
    "model/canvas",
    "model/character",
    "model/images",
    "model/inPlay",
    "controller/gameLogic",
    "model/sounds",
    "controller/localStorageManager"
  ], function(Game, Canvas, Character, Images, InPlay, GameLogic, Sounds, LSM) {
    return {
      Game,
      Canvas,
      Character,
      Images,
      InPlay,
      GameLogic,
      Sounds,
      LSM
    };
  });
  