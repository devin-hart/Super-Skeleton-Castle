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
  // game.stage.backgroundColor = '#007800';
  bg = game.add.tileSprite(0, 0, 256, 240, 'background');
  bg.fixedToCamera = true;

  map = game.add.tilemap('level1');

  map.addTilesetImage('simples_pimples');

  layer = map.createLayer('Tile Layer 1');
  layer.resizeWorld();

  map.setCollisionByExclusion([0, 108, 201, 203, 251, 253, 403, 803, 1257, 1307,
    453, 1357, 1407, 1759]);
// Collision debug
  // layer.debug = true;

// Player
  player = game.add.sprite(32, game.world.height - 150, 'player');
  // player = game.add.sprite(1166, 192, 'player');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  game.camera.follow(player);
// Player physics properties
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 1500;
  // player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [4, 5], 10, true);

// Bat info
  batGroup = game.add.group();
  game.physics.arcade.enable(batGroup, Phaser.Physics.ARCADE);
  batGroup.enableBody = true;
  batGroup.create(464, 32, 'bat');
  batGroup.create(512, 32, 'bat');
  batGroup.callAll('animations.add', 'animations', 'bat-left', [0, 1], 5, true);
  batGroup.callAll('animations.play', 'animations', 'bat-left');

// Devil info
  devilGroup = game.add.physicsGroup();
  game.physics.arcade.enable(devilGroup, Phaser.Physics.ARCADE);
  devilGroup.enableBody = true;
  devilGroup.checkWorldBounds = true;
  devilGroup.outOfBoundsKill = true;
  // devilGroup.create(1120, 208, 'devil');
  devilGroup.callAll('animations.add', 'animations', 'devil-left', [0, 1, 2], 5, true);
  devilGroup.callAll('animations.add', 'animations', 'devil-right', [3, 4, 5], 5, true);

  devilGroup.forEach(function(devilGroup) {
    devilGroup.body.velocity.x = -10;
    devilGroup.body.bounce.x = 1;
    devilGroup.body.gravity.y = 1500;
  });
// Ghost info
  ghostGroup = game.add.physicsGroup();
  game.physics.arcade.enable(ghostGroup, Phaser.Physics.ARCADE);
  ghostGroup.enableBody = true;
  ghostGroup.checkWorldBounds = true;
  ghostGroup.outOfBoundsKill = true;
  ghostGroup.create(48, 100, 'ghost');
  ghostGroup.callAll('animations.add', 'animations', 'ghost-left', [0, 1, 2], 5, true);
  ghostGroup.callAll('animations.play', 'animations', 'ghost-left');

  ghostGroup.forEach(function(ghostGroup) {
    ghostGroup.body.velocity.x = -25;
  });

// Goblin info
  goblinGroup = game.add.physicsGroup();
  game.physics.arcade.enable(goblinGroup, Phaser.Physics.ARCADE);
  goblinGroup.enableBody = true;
  goblinGroup.checkWorldBounds = true;
  goblinGroup.outOfBoundsKill = true;
  // goblinGroup.create(1120, 208, 'goblin');
  goblinGroup.callAll('animations.add', 'animations', 'goblin-left', [0, 1, 2], 5, true);
  goblinGroup.callAll('animations.add', 'animations', 'goblin-right', [3, 4, 5], 5, true);

  goblinGroup.forEach(function(goblinGroup) {
    goblinGroup.body.velocity.x = -10;
    goblinGroup.body.bounce.x = 1;
    goblinGroup.body.gravity.y = 1500;
});

// Red Skeleton Group
  redSkeletonGroup = game.add.physicsGroup();
  game.physics.arcade.enable(redSkeletonGroup, Phaser.Physics.ARCADE);
  redSkeletonGroup.enableBody = true;
  redSkeletonGroup.checkWorldBounds = true;
  redSkeletonGroup.outOfBoundsKill = true;
  // redSkeletonGroup.create(1120, 208, 'redSkeleton');
  redSkeletonGroup.callAll('animations.add', 'animations', 'redSkeleton-left', [0, 1, 2], 5, true);
  redSkeletonGroup.callAll('animations.add', 'animations', 'redSkeleton-right', [3, 4, 5], 5, true);

  redSkeletonGroup.forEach(function(redSkeletonGroup) {
    redSkeletonGroup.body.velocity.x = -10;
    redSkeletonGroup.body.bounce.x = 1;
    redSkeletonGroup.body.gravity.y = 1500;
  });

// Yellow Skeleton info

  yellowSkeletonGroup = game.add.physicsGroup();
  game.physics.arcade.enable(yellowSkeletonGroup, Phaser.Physics.ARCADE);
  yellowSkeletonGroup.enableBody = true;
  yellowSkeletonGroup.checkWorldBounds = true;
  yellowSkeletonGroup.outOfBoundsKill = true;
  // yellowSkeletonGroup.create(1120, 208, 'yellowSkeleton');
  yellowSkeletonGroup.callAll('animations.add', 'animations', 'yellowSkeleton-left', [0, 1, 2], 5, true);
  yellowSkeletonGroup.callAll('animations.add', 'animations', 'yellowSkeleton-right', [3, 4, 5], 5, true);

  yellowSkeletonGroup.forEach(function(yellowSkeletonGroup) {
    yellowSkeletonGroup.body.velocity.x = -10;
    yellowSkeletonGroup.body.bounce.x = 1;
    yellowSkeletonGroup.body.gravity.y = 1500;
  });

// Zombie info
  zombieGroup = game.add.physicsGroup();
  game.physics.arcade.enable(zombieGroup, Phaser.Physics.ARCADE);
  zombieGroup.enableBody = true;
  zombieGroup.checkWorldBounds = true;
  zombieGroup.outOfBoundsKill = true;
  zombieGroup.create(1120, 208, 'zombie');
  zombieGroup.callAll('animations.add', 'animations', 'zombie-left', [0, 1, 2], 5, true);
  zombieGroup.callAll('animations.add', 'animations', 'zombie-right', [3, 4, 5], 5, true);

  zombieGroup.forEach(function(zombieGroup) {
    zombieGroup.body.velocity.x = -10;
    zombieGroup.body.bounce.x = 1;
    zombieGroup.body.gravity.y = 1500;
  });

// Spike Down info
  spikeDown = [
    game.add.sprite(416, 112, 'spikeDown'),
    game.add.sprite(432, 112, 'spikeDown'),
    game.add.sprite(448, 112, 'spikeDown'),
    game.add.sprite(480, 112, 'spikeDown'),
    game.add.sprite(496, 112, 'spikeDown'),
    game.add.sprite(528, 112, 'spikeDown'),
    game.add.sprite(544, 112, 'spikeDown')
  ];

  spikeDown.enablebody = true;
  game.physics.arcade.enable(spikeDown, Phaser.Physics.ARCADE);

// Spike Up info
  spikeUp = [];

  spikeUp.enablebody = true;
  game.physics.arcade.enable(spikeUp, Phaser.Physics.ARCADE);

// Invisible walls info
  invisWall = game.add.group();
  game.physics.arcade.enable(invisWall, Phaser.Physics.ARCADE);
  invisWall.enableBody = true;
  invisWall.immovable = true;
  invisWall.create(1152, 208, 'invisWall');
  invisWall.create(1072, 208, 'invisWall');



// Collectibles
  // papers = game.add.group();
  // papers.enableBody = true;
  //
  // for (var i = 0; i < 10; i++) {
  //   var paper = papers.create(i * 70, 0, 'paper');
  //   paper.body.gravity.y = 300;
  //   paper.body.bounce.y = 0.3 + Math.random() * 0.2;
  // }

// Score
  scoreText = game.add.text(8, 8, '000000', {
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

  game.physics.arcade.collide(redSkeletonGroup, layer);
  game.physics.arcade.collide(redSkeletonGroup, invisWall);

  game.physics.arcade.collide(yellowSkeletonGroup, layer);
  game.physics.arcade.collide(yellowSkeletonGroup, invisWall);

  game.physics.arcade.collide(zombieGroup, layer);
  game.physics.arcade.collide(zombieGroup, invisWall);

  // game.physics.arcade.collide(papers, layer);

// Overlap functions
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
    } else {
      playerDie();
    }
  });

  // , null, this ^ if broken insert between } & );

  game.physics.arcade.collide(player, goblinGroup, function(player, goblinGroup) {
    if (goblinGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      goblinGroup.kill();
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, redSkeletonGroup, function(player, redSkeletonGroup) {
    if (redSkeletonGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      redSkeletonGroup.kill();
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, yellowSkeletonGroup, function(player, yellowSkeletonGroup) {
    if (yellowSkeletonGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      yellowSkeletonGroup.kill();
    } else {
      playerDie();
    }
  });

  game.physics.arcade.collide(player, zombieGroup, function(player, zombieGroup) {
    if (zombieGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      zombieGroup.kill();
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

// function collectPaper(player, paper) {
//   paper.kill();
//   score += 1;
//   scoreText.text = 'Papers Collected: ' + score + '/10';
//   if (score === 10) {
//     scoreText.text = 'You win!'
//   };
// }

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
