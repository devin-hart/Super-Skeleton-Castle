var Phaser = Phaser || {};
var Platformer = Platformer || {};

var game = new Phaser.Game(256, 240, Phaser.CANVAS);
game.state.add("BootState", new Platformer.BootState());
game.state.add("LoadingState", new Platformer.LoadingState());
game.state.add("GameState", new Platformer.TiledState());
game.state.start("BootState", true, false, "assets/levels/level1.json");
