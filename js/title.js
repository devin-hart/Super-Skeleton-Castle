var titleState = {

  preload: function () {

    game.load.image('titleScreen', 'assets/images/title_screen.png');

    game.physics.startSystem(Phaser.Physics.ARCADE);

  // Tilemaps
    game.load.tilemap('level1', 'assets/levels/level1_map_final.json', null, Phaser.Tilemap.TILED_JSON);

  // Images
    game.load.image('background', 'assets/images/bg_grad.png');
    game.load.image('chest', 'assets/images/chest.png');
    game.load.image('invisWall', 'assets/images/invisible_wall.png');
    game.load.image('simples_pimples', 'assets/images/simples_pimples.png');
    game.load.image('spikeDown', 'assets/images/spike_down.png');
    game.load.image('spikeUp', 'assets/images/spike_up.png');

  // Spritesheets
    game.load.spritesheet('player', 'assets/images/skeletal_player.png', 16, 16);
    game.load.spritesheet('bat', 'assets/images/bat.png', 16, 16);
    game.load.spritesheet('devil', 'assets/images/devil.png', 16, 16);
    game.load.spritesheet('ghost', 'assets/images/ghost.png', 16, 16);
    game.load.spritesheet('goblin', 'assets/images/goblin.png', 16, 16);
    game.load.spritesheet('redSkeleton', 'assets/images/red_skeleton.png', 16, 16);
    game.load.spritesheet('yellowSkeleton', 'assets/images/yellow_skeleton.png', 16, 16);
    game.load.spritesheet('zombie', 'assets/images/zombie.png', 16, 16);

  // Audio
    game.load.audio('music', 'assets/audio/music.mp3');
    game.load.audio('jump', 'assets/audio/jump.wav');

  },

  create: function () {

    var titleScreen = game.add.tileSprite(0, 0, 256, 240, 'titleScreen');
    game.state.start('game');
  },


};
