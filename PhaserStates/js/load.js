var loadState = {

  preload: function () {

    var loadingLabel = game.add.text(80, 150, 'Loading...',
  { font: '30px Courier', fill : '#FFFFFF'});

  game.load.image('player', 'assets/player.png');
  game.load.image('win', 'assets/win.png');

  },

  create: function () {

    game.state.start('menu');
  }
  
};
