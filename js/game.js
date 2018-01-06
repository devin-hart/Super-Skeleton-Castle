// NES Res 256, 240

var game = new Phaser.Game(256, 240, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

game.state.add('game', game);

function preload() {

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

};

// Level vars
var map;
var layer;
var bg;
var invisWall;
var chest;

// Player vars
var player;
var controls;
var jumpButton;

// Enemy vars
var spikeDown;
var spikeUp;
var batGroup;
var devilGroup;
var goblinGroup;
var ghostGroup;
var redSkeletonGroup;
var yellowSkeletonGroup;
var zombieGroup;

// SFX vars
var music;
var jumpSound;

// Collectible vars
var score = 0;
var scoreText;


function create() {
  // game.world.setBounds(-1000, -1000, 2000, 2000);
  bg = game.add.tileSprite(0, 0, 256, 240, 'background');
  bg.fixedToCamera = true;

  map = game.add.tilemap('level1');

  map.addTilesetImage('simples_pimples');

  layer = map.createLayer('Tile Layer 1');
  layer.resizeWorld();

  map.setCollisionByExclusion([0, 108, 201, 203, 251, 253, 403, 803, 1257, 1307,
    453, 1357, 1407, 1759, 2006, 2007, 2051, 2052, 2053, 2055, 2056, 2057, 2101,
    2102, 2306, 2307, 2309, 2355, 2356, 2357, 2359, 2404, 2454, 2503, 2504, 2552]);
// Collision debug
  // layer.debug = true;

// Player
  player = game.add.sprite(32, game.world.height - 150, 'player');
  // player = game.add.sprite(2288, 112, 'player');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  game.camera.follow(player);
// Player physics properties
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 1500;
  // player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [4, 5], 10, true);

// Chest
  chest = game.add.sprite(3568, 128, 'chest');
  chest.enablebody = true;
  game.physics.arcade.enable(chest, Phaser.Physics.ARCADE);


// Bat info
  batGroup = game.add.group();
  game.physics.arcade.enable(batGroup, Phaser.Physics.ARCADE);
  batGroup.enableBody = true;
  batGroup.create(496, 192, 'bat');
  batGroup.create(1184, 48, 'bat');
  batGroup.create(832, 208, 'bat');
  batGroup.create(1232, 48, 'bat');
  batGroup.create(3056, 160, 'bat');
  batGroup.create(3168, 160, 'bat');
  batGroup.create(3216, 160, 'bat');

  batGroup.callAll('animations.add', 'animations', 'bat-left', [0, 1], 5, true);
  batGroup.callAll('animations.play', 'animations', 'bat-left');

// Devil info
  devilGroup = game.add.physicsGroup();
  game.physics.arcade.enable(devilGroup, Phaser.Physics.ARCADE);
  devilGroup.enableBody = true;
  devilGroup.checkWorldBounds = true;
  devilGroup.outOfBoundsKill = true;
  devilGroup.create(1564, 64, 'devil');
  devilGroup.create(1888, 128, 'devil');
  devilGroup.create(2064, 128, 'devil');
  devilGroup.create(2192, 128, 'devil');
  devilGroup.callAll('animations.add', 'animations', 'devil-left', [0, 1, 2], 6, true);
  devilGroup.callAll('animations.add', 'animations', 'devil-right', [3, 4, 5], 6, true);

  devilGroup.forEach(function(devilGroup) {
    devilGroup.body.velocity.x = -75;
    devilGroup.body.bounce.x = 1;
    devilGroup.body.gravity.y = 1500;
  });
// Ghost info
  ghostGroup = game.add.physicsGroup();
  game.physics.arcade.enable(ghostGroup, Phaser.Physics.ARCADE);
  ghostGroup.enableBody = true;
  ghostGroup.checkWorldBounds = true;
  ghostGroup.outOfBoundsKill = true;
  ghostGroup.create(336, 144, 'ghost');
  ghostGroup.create(832, 144, 'ghost');
  ghostGroup.callAll('animations.add', 'animations', 'ghost-left', [0, 1, 2], 5, true);
  ghostGroup.callAll('animations.add', 'animations', 'ghost-right', [3, 4, 5], 5, true);
  ghostGroup.callAll('animations.play', 'animations', 'ghost-left');

  ghostGroup.forEach(function(ghostGroup) {
    ghostGroup.body.velocity.x = -50;
    ghostGroup.body.bounce.x = 1;
  });

// Goblin info
  goblinGroup = game.add.physicsGroup();
  game.physics.arcade.enable(goblinGroup, Phaser.Physics.ARCADE);
  goblinGroup.enableBody = true;
  goblinGroup.checkWorldBounds = true;
  goblinGroup.outOfBoundsKill = true;
  goblinGroup.create(624, 256, 'goblin');
  goblinGroup.create(736, 176, 'goblin');
  goblinGroup.create(1008, 64, 'goblin');
  goblinGroup.callAll('animations.add', 'animations', 'goblin-left', [0, 1, 2], 5, true);
  goblinGroup.callAll('animations.add', 'animations', 'goblin-right', [3, 4, 5], 5, true);

  goblinGroup.forEach(function(goblinGroup) {
    goblinGroup.body.velocity.x = -50;
    goblinGroup.body.bounce.x = 1;
    goblinGroup.body.gravity.y = 1500;
});

// Red Skeleton Group
  redSkeletonGroup = game.add.physicsGroup();
  game.physics.arcade.enable(redSkeletonGroup, Phaser.Physics.ARCADE);
  redSkeletonGroup.enableBody = true;
  redSkeletonGroup.checkWorldBounds = true;
  redSkeletonGroup.outOfBoundsKill = true;
  redSkeletonGroup.create(2320, 96, 'redSkeleton');
  redSkeletonGroup.create(2528, 176, 'redSkeleton');
  redSkeletonGroup.create(2608, 160, 'redSkeleton');
  redSkeletonGroup.callAll('animations.add', 'animations', 'redSkeleton-left', [1], 1, true);
  redSkeletonGroup.callAll('animations.add', 'animations', 'redSkeleton-right', [3, 4, 5], 5, true);

  redSkeletonGroup.forEach(function(redSkeletonGroup) {
    redSkeletonGroup.body.bounce.x = 1;
    redSkeletonGroup.body.bounce.y = 1;
    redSkeletonGroup.body.velocity.y = -25;
  });

// Yellow Skeleton info

  yellowSkeletonGroup = game.add.physicsGroup();
  game.physics.arcade.enable(yellowSkeletonGroup, Phaser.Physics.ARCADE);
  yellowSkeletonGroup.enableBody = true;
  yellowSkeletonGroup.checkWorldBounds = true;
  yellowSkeletonGroup.outOfBoundsKill = true;
  yellowSkeletonGroup.create(2432, 160, 'yellowSkeleton');
  yellowSkeletonGroup.create(2688, 160, 'yellowSkeleton');
  yellowSkeletonGroup.create(2896, 240, 'yellowSkeleton');
  yellowSkeletonGroup.create(2960, 240, 'yellowSkeleton');
  yellowSkeletonGroup.create(3344, 144, 'yellowSkeleton');
  yellowSkeletonGroup.create(3392, 144, 'yellowSkeleton');
  yellowSkeletonGroup.create(3456, 128, 'yellowSkeleton');
  yellowSkeletonGroup.create(3504, 128, 'yellowSkeleton');
  yellowSkeletonGroup.create(3552, 128, 'yellowSkeleton');
  yellowSkeletonGroup.callAll('animations.add', 'animations', 'yellowSkeleton-left', [0, 1, 2], 5, true);
  yellowSkeletonGroup.callAll('animations.add', 'animations', 'yellowSkeleton-right', [3, 4, 5], 5, true);

  yellowSkeletonGroup.forEach(function(yellowSkeletonGroup) {
    yellowSkeletonGroup.body.velocity.x = -30;
    yellowSkeletonGroup.body.bounce.x = 1;
    yellowSkeletonGroup.body.gravity.y = 1500;
  });

// Zombie info
  zombieGroup = game.add.physicsGroup();
  game.physics.arcade.enable(zombieGroup, Phaser.Physics.ARCADE);
  zombieGroup.enableBody = true;
  zombieGroup.checkWorldBounds = true;
  zombieGroup.outOfBoundsKill = true;
  zombieGroup.create(144, 208, 'zombie');
  zombieGroup.create(244, 208, 'zombie');
  zombieGroup.callAll('animations.add', 'animations', 'zombie-left', [0, 1, 2], 5, true);
  zombieGroup.callAll('animations.add', 'animations', 'zombie-right', [3, 4, 5], 5, true);

  zombieGroup.forEach(function(zombieGroup) {
    zombieGroup.body.velocity.x = -10;
    zombieGroup.body.bounce.x = 1;
    zombieGroup.body.gravity.y = 1500;
  });

// Spike Down info
  spikeDown = [
    game.add.sprite(800, 272, 'spikeDown'),
    game.add.sprite(816, 272, 'spikeDown'),
    game.add.sprite(1088, 112, 'spikeDown'),
    game.add.sprite(1104, 112, 'spikeDown'),
    game.add.sprite(1152, 112, 'spikeDown'),
    game.add.sprite(1168, 112, 'spikeDown'),
    game.add.sprite(1200, 112, 'spikeDown'),
    game.add.sprite(1216, 112, 'spikeDown'),
    game.add.sprite(1248, 112, 'spikeDown'),
    game.add.sprite(1264, 112, 'spikeDown'),
    game.add.sprite(1408, 144, 'spikeDown'),
    game.add.sprite(1424, 128, 'spikeDown'),
    game.add.sprite(1456, 128, 'spikeDown')
  ];

  spikeDown.enablebody = true;
  game.physics.arcade.enable(spikeDown, Phaser.Physics.ARCADE);

// Spike Up info
  spikeUp = [
    game.add.sprite(544, 208, 'spikeUp'),
    game.add.sprite(848, 224, 'spikeUp'),
    game.add.sprite(896, 32, 'spikeUp'),
    game.add.sprite(912, 32, 'spikeUp')
  ];

  spikeUp.enablebody = true;
  game.physics.arcade.enable(spikeUp, Phaser.Physics.ARCADE);

// Invisible walls info
  invisWall = game.add.group();
  // game.physics.arcade.enable(invisWall, Phaser.Physics.ARCADE);
  invisWall.enableBody = true;
// Add more invisWalls below

  invisWall.create(272, 144, 'invisWall');
  invisWall.create(464, 144, 'invisWall');
  invisWall.create(528, 256, 'invisWall');
  invisWall.create(672, 176, 'invisWall');
  invisWall.create(784, 176, 'invisWall');
  invisWall.create(944, 64, 'invisWall');
  invisWall.create(1152, 64, 'invisWall');
  invisWall.create(1504, 64, 'invisWall');
  invisWall.create(1680, 64, 'invisWall');
  invisWall.create(1824, 128, 'invisWall');
  invisWall.create(1952, 128, 'invisWall');
  invisWall.create(2016, 128, 'invisWall');
  invisWall.create(2128, 128, 'invisWall');
  invisWall.create(2320, 64, 'invisWall');
  invisWall.create(2464, 160, 'invisWall');
  invisWall.create(2528, 144, 'invisWall');
  invisWall.create(2608, 128, 'invisWall');
  invisWall.create(2640, 160, 'invisWall');
  invisWall.create(2720, 160, 'invisWall');
  invisWall.create(3312, 144, 'invisWall');
  invisWall.create(3424, 128, 'invisWall');
  invisWall.create(3424, 144, 'invisWall');



// invisWall properties
  invisWall.setAll('body.immovable', true);
  invisWall.setAll('body.moves', false);
  invisWall.alpha = 0;

// Score
  scoreText = game.add.text(8, 8, score, {
    fontSize: '12px',
    fill: '#FFFFFF'
  });

  scoreText.fixedToCamera = true;

// Player controls
  controls = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

// Audio
  music = game.add.audio('music');
  music.play();
  music.loopFull();

  jumpSound = game.add.audio('jump');

// Click to go full screen
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.input.onDown.add(goFullScreen);
}

function update() {

// Asset collision
  game.physics.arcade.collide(player, layer);

  game.physics.arcade.collide(batGroup, layer);
  game.physics.arcade.collide(batGroup, invisWall);

  game.physics.arcade.collide(devilGroup, layer);
  game.physics.arcade.collide(devilGroup, invisWall);

  game.physics.arcade.collide(goblinGroup, layer);
  game.physics.arcade.collide(goblinGroup, invisWall);

  game.physics.arcade.collide(ghostGroup, invisWall);
  game.physics.arcade.collide(ghostGroup, layer);

  game.physics.arcade.collide(redSkeletonGroup, layer);
  game.physics.arcade.collide(redSkeletonGroup, invisWall);

  game.physics.arcade.collide(yellowSkeletonGroup, layer);
  game.physics.arcade.collide(yellowSkeletonGroup, invisWall);

  game.physics.arcade.collide(zombieGroup, layer);
  game.physics.arcade.collide(zombieGroup, invisWall);

// Overlap functions
  game.physics.arcade.overlap(player, chest, playerDie, null, this);
  game.physics.arcade.overlap(player, devilGroup, playerDie, null, this);
  game.physics.arcade.overlap(player, ghostGroup, playerDie, null, this);
  game.physics.arcade.overlap(player, spikeDown, playerDie, null, this);
  game.physics.arcade.overlap(player, spikeUp, playerDie, null, this);
  // game.physics.arcade.overlap(player, papers, collectPaper, null, this);

// Reset the players velocity (movement)
  player.body.velocity.x = 0;

// Player controls
  if (controls.left.isDown) {
// Move to the left
    player.body.velocity.x = -100;
    player.animations.play('left');
  } else if (controls.right.isDown) {
// Move to the right
    player.body.velocity.x = 100;
    player.animations.play('right');
  } else {
// Stand still
    player.animations.stop();
    // player.frame = 3;
  }

// Jump
  if (jumpButton.isDown && player.body.onFloor()) {
    player.body.velocity.y = -350;
    jumpSound.play();
  }

  if (!player.inWorld) {
    playerDie();
  }

// Kill enemy on jump (bat, goblin, red and yellow skeleton, zombie)
  game.physics.arcade.collide(player, batGroup, function(player, batGroup) {
    if (batGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      batGroup.kill();
      score += 25;
      scoreText.text = score;
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, goblinGroup, function(player, goblinGroup) {
    if (goblinGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      goblinGroup.kill();
      score += 100;
      scoreText.text = score;
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, redSkeletonGroup, function(player, redSkeletonGroup) {
    if (redSkeletonGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      redSkeletonGroup.kill();
      score += 150;
      scoreText.text = score;
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, yellowSkeletonGroup, function(player, yellowSkeletonGroup) {
    if (yellowSkeletonGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      yellowSkeletonGroup.kill();
      score += 100;
      scoreText.text = score;
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, zombieGroup, function(player, zombieGroup) {
    if (zombieGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      zombieGroup.kill();
      score += 50;
      scoreText.text = score;
    } else {
      playerDie();
    }
  });

// Render left and right animation

  batGroup.forEach(function(batGroup) {
    if (batGroup.body.velocity.x > 0) {
      batGroup.animations.play('bat-right');
    } else {
      batGroup.animations.play('bat-left');
    }
  });

  devilGroup.forEach(function(devilGroup) {
    if (devilGroup.body.velocity.x > 0) {
      devilGroup.animations.play('devil-right');
    } else {
      devilGroup.animations.play('devil-left');
    }
  });

  ghostGroup.forEach(function(ghostGroup) {
    if (ghostGroup.body.velocity.x > 0) {
      ghostGroup.animations.play('ghost-right');
    } else {
      ghostGroup.animations.play('ghost-left');
    }
  });

  goblinGroup.forEach(function(goblinGroup) {
    if (goblinGroup.body.velocity.x > 0) {
      goblinGroup.animations.play('goblin-right');
    } else {
      goblinGroup.animations.play('goblin-left');
    }
  });

  redSkeletonGroup.forEach(function(redSkeletonGroup) {
    if (redSkeletonGroup.body.velocity.x > 0) {
      redSkeletonGroup.animations.play('redSkeleton-right');
    } else {
      redSkeletonGroup.animations.play('redSkeleton-left');
    }
  });

  yellowSkeletonGroup.forEach(function(yellowSkeletonGroup) {
    if (yellowSkeletonGroup.body.velocity.x > 0) {
      yellowSkeletonGroup.animations.play('yellowSkeleton-right');
    } else {
      yellowSkeletonGroup.animations.play('yellowSkeleton-left');
    }
  });

  zombieGroup.forEach(function(zombieGroup) {
    if (zombieGroup.body.velocity.x > 0) {
      zombieGroup.animations.play('zombie-right');
    } else {
      zombieGroup.animations.play('zombie-left');
    }
  });

}

function render() {
// Sprite debug info
  // game.debug.spriteInfo(player, 16, 16);
}

function goFullScreen() {
  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen(false);
  }
}

function playerDie() {
  score = 0;
  music.stop();
  game.state.start(game.state.current);
}
