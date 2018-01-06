var game = new Phaser.Game(256, 240, Phaser.AUTO);

game.state.add('boot', bootState);
game.state.add('title', titleState);
game.state.add('game', game);
game.state.add('end', endState);

game.state.start('boot');
