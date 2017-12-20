var loadState = {

  preload: function () {

    // Create loading text
    var loadingLabel = game.add.text(80, 150, 'Loading...',
  { font: '30px Courier', fill : '#FFFFFF'});

  // Loads assets
  game.load.spritesheet('player', 'assets/SP_player_spritesheet.png', 16, 16);
  game.load.image('win', 'assets/win.png');

  },

  create: function () {

    // Loads 'menu' state
    game.state.start('menu');
  }

};
