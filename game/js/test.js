var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

// Tilemaps
  game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);

// Images
  game.load.image('tiles-1', 'assets/images/tiles-1.png');
  game.load.image('sky', 'assets/images/sky.png');
  game.load.image('ground', 'assets/images/platform.png');
  game.load.image('paper', 'assets/images/paper.png');

// Spritesheets
  game.load.spritesheet('dude', 'assets/images/dude1.png', 32, 48);
  game.load.spritesheet('enemy', 'assets/images/baddie.png', 32, 32);

// Audio
  game.load.audio('music', 'assets/audio/music.mp3');
  game.load.audio('jump', 'assets/audio/jump.wav');

}

// Level vars
var map;
var tileset;
var layer;

// Player vars
var player;
var controls;

// Enemy vars
var enemy;
// SFX vars
var music;
var jumpSound;

// Collectible vars
var papers;
var score = 0;
var scoreText;

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#000000';

  map = game.add.tilemap('level1');

  map.addTilesetImage('tiles-1');

  // map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

  layer = map.createLayer('Tile Layer 1');
  map.setCollision(1);
  //  Un-comment this on to see the collision tiles
  // layer.debug = true;

  layer.resizeWorld();

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  enemy = game.add.sprite(32, game.world.height - 150, 'enemy');

  enemy.enableBody = true;

  //  We need to enable physics on the player
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);

  game.physics.arcade.enable(enemy, Phaser.Physics.ARCADE);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  game.camera.follow(player);

  //  Finally some papers to collect
  papers = game.add.group();

  //  We will enable physics for any paper that is created in this group
  papers.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 10; i++) {
    //  Create a paper inside of the 'papers' group
    var paper = papers.create(i * 70, 0, 'paper');

    //  Let gravity do its thing
    paper.body.gravity.y = 300;

    //  This just gives each paper a slightly random bounce value
    paper.body.bounce.y = 0.3 + Math.random() * 0.2;
  }

  //  The score
  scoreText = game.add.text(8, 8, 'Papers Collected: 0/10', {
    fontSize: '12px',
    fill: '#FFFFFF'
  });

  scoreText.fixedToCamera = true;

  //  Our controls.
  controls = game.input.keyboard.createCursorKeys();

  // Audio
  music = game.add.audio('music');
  music.play();

  jumpSound = game.add.audio('jump');
}

function update() {

  //  Collide the player and the papers with the platforms
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(papers, layer);

  //  Checks to see if the player overlaps with any of the papers, if he does call the collectPaper function
  game.physics.arcade.overlap(player, papers, collectPaper, null, this);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (controls.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if (controls.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if (controls.up.isDown && player.body.onFloor()) {
    player.body.velocity.y = -350;
    jumpSound.play();

  }

}

function collectPaper(player, paper) {

  // Removes the paper from the screen
  paper.kill();

  //  Add and update the score
  score += 1;
  scoreText.text = 'Papers Collected: ' + score + '/10';

  if (score === 10) {
    scoreText.text = "You win!"
  };

}
