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
  game.load.image('simples_pimples', 'assets/images/simples_pimples.png');
  game.load.image('spikeDown', 'assets/images/spike_down.png');
  game.load.image('background', 'assets/images/bg_grad.png');

  // Spritesheets
  game.load.spritesheet('player', 'assets/images/skeletal_player.png', 16, 16);
  game.load.spritesheet('bat', 'assets/images/bat.png', 16, 16);
  game.load.spritesheet('ghost', 'assets/images/ghost.png', 16, 16);
  game.load.spritesheet('zombie', 'assets/images/zombie.png', 16, 16);

  // Audio
  game.load.audio('music', 'assets/audio/music.mp3');
  game.load.audio('jump', 'assets/audio/jump.wav');

};

// Level vars
var map;
var layer;
var bg;

// Player vars
var player;
var controls;
var jumpButton;

// Enemy vars
var spikeDown;
var batGroup;
var ghostGroup;
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
  bg = game.add.tileSprite(0, 0, 1000, 600, 'background');
  bg.fixedToCamera = true;

  map = game.add.tilemap('level1');

  map.addTilesetImage('simples_pimples');

  layer = map.createLayer('Tile Layer 1');
  layer.resizeWorld();

  map.setCollisionByExclusion([0, 1758]);
  //  Collision debug
  // layer.debug = true;

  // Player
  player = game.add.sprite(32, game.world.height - 150, 'player');
  // player = game.add.sprite(1070, 192, 'player');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  game.camera.follow(player);
  //  Player physics properties.
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 1250;
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
  });

  // Spikes
  spikeDown = [game.add.sprite(416, 112, 'spikeDown'),
    game.add.sprite(432, 112, 'spikeDown'),
    game.add.sprite(448, 112, 'spikeDown'),
    game.add.sprite(480, 112, 'spikeDown'),
    game.add.sprite(496, 112, 'spikeDown'),
    game.add.sprite(528, 112, 'spikeDown'),
    game.add.sprite(544, 112, 'spikeDown')
  ];

  spikeDown.enablebody = true;
  game.physics.arcade.enable(spikeDown, Phaser.Physics.ARCADE);

  // Collectibles
  // papers = game.add.group();
  // papers.enableBody = true;
  //
  // for (var i = 0; i < 10; i++) {
  //   var paper = papers.create(i * 70, 0, 'paper');
  //   paper.body.gravity.y = 300;
  //   paper.body.bounce.y = 0.3 + Math.random() * 0.2;
  // }

  // The score
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
  game.input.onDown.add(gofull);
}

function update() {

  // Asset collision
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(batGroup, layer);
  game.physics.arcade.collide(zombieGroup, layer);
  // game.physics.arcade.collide(papers, layer);

  // Overlap functions
  game.physics.arcade.overlap(player, spikeDown, playerDie, null, this);
  game.physics.arcade.overlap(player, ghostGroup, playerDie, null, this);
  // game.physics.arcade.overlap(player, papers, collectPaper, null, this);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  // Player controls
  if (controls.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -100;
    player.animations.play('left');
  } else if (controls.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 100;
    player.animations.play('right');
  } else {
    //  Stand still
    player.animations.stop();
    // player.frame = 3;
  }

  //  Allow the player to jump if they are touching the ground
  if (jumpButton.isDown && player.body.onFloor()) {
    player.body.velocity.y = -350;
    jumpSound.play();

  }

  if (!player.inWorld) {
    playerDie();
  }

  game.physics.arcade.collide(player, batGroup, function(player, batGroup) {
    if (batGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      batGroup.kill();
    } else {
      playerDie();
    }
  });

  // , null, this ^ if broken insert between } & );

  game.physics.arcade.collide(player, zombieGroup, function(player, zombieGroup) {
    if (zombieGroup.body.touching.up && player.body.touching.down) {
      player.body.velocity.y = -300;
      zombieGroup.kill();
    } else {
      playerDie();
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
  // game.debug.spriteInfo(player, 32, 32);
}

// function collectPaper(player, paper) {
//   paper.kill();
//   score += 1;
//   scoreText.text = 'Papers Collected: ' + score + '/10';
//   if (score === 10) {
//     scoreText.text = 'You win!'
//   };
// }

function gofull() {
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
