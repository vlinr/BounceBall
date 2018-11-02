var gameConfig = {
	food: ['food', 'ract', 'two', 'cir'], //Style element, add one-to-one, if add a food, then you need to add a food outline to the JSON file
	gravity: 1500, //Default gravity
	dtip: 'vlinr.com', //Maximum distance mark
	dtipBottom: 'bottomLine', //Mark of bottom distance
	foodName: '微拎网', //Food signs
	speed: 3000, //speed
	distance: document.documentElement.clientHeight / 2, //The distance between two elements
	defaultPosition: 0, //Maximum operating distance
	scaleX: document.documentElement.clientWidth / 375, //Horizontal scaling
	scaleY: document.documentElement.clientHeight / 667, //Vertical release degree
	score: 0, //Score, resurrection does not reset this score.
	revive: false, //Is it resurrection?
	weather: 2, //1 represents sunny days, 2 represents rain, and 3 represents cloudy days.
	weatherArr: ['sun', 'rain', 'cloud'] //state diagram
}
gameConfig.defaultPosition = gameConfig.gravity / 8; //Default maximum rising distance

//Load Resources
function LoadGame(game) {
	this.init = function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}
	//Load Resources
	this.preload = function() {
		var self = this;
		game.add.sprite(0, 0, drawBackground(self.game, game.width, game.height, 0x7d6ddd, 0xed8ad0)); //Draw the background
		//Drawing loading elements
		var loadArr = [];
		for(var i = 0; i < 3; i++) {
			self.g = game.add.graphics(game.world.centerX, game.world.centerY);
			self.g.beginFill(0xffffff, 1)
			loadArr.push(this.g.drawCircle(0, -2, 60));
			self.g.endFill();
		}
		for(var i = 0; i < loadArr.length; i++) {
			game.add.tween(loadArr[i].scale).to({
				x: 2,
				y: 2
			}, 2000, Phaser.Easing.Cubic.Out, true, i * 500, -1);
			game.add.tween(loadArr[i]).to({
				alpha: 0
			}, 2000, Phaser.Easing.Cubic.Out, true, i * 500, -1);
		}
		self.loadTxt = game.add.text(game.world.centerX, game.world.centerY, '0%', {
			'fill': '#7d6ddd',
			'fontSize': '24px',
			'font-family': 'Microsoft YaHei'
		});
		self.loadTxt.anchor.set(.5);
		self.loadTxt.fontWeight = 0;
		self.loadTxt.stroke = '#ed8ad0';
		self.loadTxt.strokeThickness = 1;
		game.load.path = 'images/';
		game.load.physics('physics', "physics.json");
		for(var i = 0; i < gameConfig.food.length; i++) {
			game.load.image(gameConfig.food[i], gameConfig.food[i] + '.png');
		}
		game.load.image('player', 'player.png');
		game.load.image('line', 'line.png');
		game.load.image('handcir', 'handcir.png');
		game.load.image('hand', 'hand.png');
		game.load.image('tl', 'tl.png');
		game.load.image('tr', 'tr.png');
		game.load.image('up', 'up.png');
		game.load.image('build', 'build.png');
		game.load.image('start', 'start.png');
		game.load.image('photo', 'photo.jpg');
		game.load.image('ranking', 'ranking.png');
		game.load.image('rule', 'rule.png');
		//Ranking resources
		game.load.image('mountain', 'mountain.png');
		game.load.image('friends1', 'friends1.png');
		game.load.image('friends2', 'friends2.png');
		game.load.image('back', 'back.png');
		game.load.image('world1', 'world1.png');
		game.load.image('world2', 'world2.png');
		game.load.image('rankingBg', 'rankingBg.png');
		game.load.image('rankingName', 'rankingName.png');

		for(var i = 0; i < gameConfig.weatherArr.length; i++) {
			game.load.image(gameConfig.weatherArr[i], gameConfig.weatherArr[i] + '.png');
		}
		game.load.image('share', 'share.png');
		game.load.spritesheet('star', 'star.png', 200, 200);
		game.load.onFileComplete.add(function() {
			self.loadTxt.text = game.load.progress + '%';
		});
		game.load.onLoadComplete.add(function() {
			game.time.events.add(Phaser.Timer.SECOND, function () {
				game.state.add('GameBegin', GameBegin);
				game.state.start('GameBegin');
	        }, this);
		});
	}
	this.create = function() {

	}
	this.update = function() {

	}
	this.render = function() {

	}
}

function GameBegin(game) {
	this.init = function() {

	}
	this.preload = function() {

	}
	this.create = function() {
		gameConfig.weather=game.rnd.integerInRange(1,gameConfig.weatherArr.length);//Random weather
		game.add.sprite(0, 0, drawBackground(this.game, game.width, game.height, 0x7d6ddd, 0xed8ad0)); //Draw the background
		this.minit();
	}
	this.addTrCloud = function() {
		var self = this;
		self.tr = game.add.image(game.world.width, 0, 'tr');
		self.tr.anchor.set(1, 0);
		var tween = game.add.tween(self.tr).to({
			x: self.tr.x + 10,
			alpha: .9
		}, 1000, Phaser.Easing.Linear.InOut, true, 0, -1, true);
	}
	this.addTlCloud = function() {
		var self = this;
		self.tl = game.add.image(0, 0, 'tl');
		self.tl.anchor.set(0, 0);
		var tween = game.add.tween(self.tl).to({
			x: self.tl.x - 10,
			alpha: .9
		}, 1000, Phaser.Easing.Linear.InOut, true, 0, -1, true);
	}
	this.addTitle = function() {
		this.title = game.add.image(game.world.centerX, game.world.centerY / 1.8, 'up');
		this.title.anchor.set(.5);
		this.title.scale.set(gameConfig.scaleX);
	}
	this.addBuild = function() {
		this.build = game.add.image(game.world.centerX, 0, 'build');
		this.build.anchor.set(.5);
		this.build.scale.set(gameConfig.scaleX);
		this.build.y = game.world.height - this.build.height / 1.5;
	}
	//Button group
	this.addBottomBtn = function() {
		this.btnGroup = game.add.group();
		this.btnGroup.x = 0;
		this.btnGroup.y = game.height / 1.2
		this.graphicsBtm = game.add.graphics(0, 0);
		this.graphicsBtm.beginFill(0xffffff, 1)
		this.graphicsBtm.drawRect(0, 0, game.width, game.height / 3);
		this.graphicsBtm.endFill();
		//Rankings button
		this.ranking = game.add.image(game.world.centerX, 0, 'ranking');
		this.ranking.anchor.set(.5);
		this.ranking.scale.set(gameConfig.scaleX);
		this.ranking.y = this.graphicsBtm.height / 2 - this.ranking.height / 1.5;
		this.ranking.inputEnabled = true;
		this.ranking.events.onInputDown.add(function(){
			game.state.add('Ranking',Ranking);
			game.state.start('Ranking');
		});
		//Game rule button
		this.rule = game.add.image(0, 0, 'rule');
		this.rule.anchor.set(.5);
		this.rule.scale.set(gameConfig.scaleX);
		this.rule.y = this.graphicsBtm.height / 2 - this.rule.height / 1.5;
		this.rule.x = this.ranking.x - this.ranking.width - this.rule.width * 1.5;
		this.rule.inputEnabled = true;
		//Share button
		this.share = game.add.image(0, 0, 'share');
		this.share.anchor.set(.5);
		this.share.scale.set(gameConfig.scaleX);
		this.share.y = this.graphicsBtm.height / 2 - this.share.height / 1.5;
		this.share.x = this.ranking.x + this.ranking.width + this.rule.width * 1.5;
		this.share.inputEnabled = true;
		this.btnGroup.add(this.graphicsBtm);
		this.btnGroup.add(this.ranking);
		this.btnGroup.add(this.rule);
		this.btnGroup.add(this.share);
	}
	this.addStart = function() {
		var self = this;
		self.begin = game.add.image(game.world.centerX, game.height / 1.45, 'start');
		self.begin.anchor.set(.5);
		self.begin.scale.set(gameConfig.scaleX);
		self.begin.inputEnabled = true;
		self.benginTime = game.time.create(true);
		self.startTween(self);
		self.benginTime.loop(4000, function() {
			self.startTween(self);
		});
		self.benginTime.start();
		self.begin.events.onInputDown.add(function() {
			self.vanish();
			self.benginTime.stop();
		}, this);
	}
	this.startTween = function(self) {
		var tween = game.add.tween(self.begin).to({
			angle: 6
		}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween.onComplete.add(function() {
			tween = game.add.tween(self.begin).to({
				angle: 0
			}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
			tween.onComplete.add(function() {
				tween = game.add.tween(self.begin).to({
					angle: -6
				}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
				tween.onComplete.add(function() {
					tween = game.add.tween(self.begin).to({
						angle: 0
					}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
					tween.onComplete.add(function() {
						tween = game.add.tween(self.begin).to({
							angle: 3
						}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
						tween.onComplete.add(function() {
							tween = game.add.tween(self.begin).to({
								angle: 0
							}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
							tween.onComplete.add(function() {
								tween = game.add.tween(self.begin).to({
									angle: -3
								}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
								tween.onComplete.add(function() {
									tween = game.add.tween(self.begin).to({
										angle: 0
									}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
									tween.onComplete.add(function() {
										tween = game.add.tween(self.begin).to({
											angle: 2
										}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
										tween.onComplete.add(function() {
											tween = game.add.tween(self.begin).to({
												angle: 0
											}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
											tween.onComplete.add(function() {
												tween = game.add.tween(self.begin).to({
													angle: -2
												}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
												tween.onComplete.add(function() {
													tween = game.add.tween(self.begin).to({
														angle: 0
													}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
													tween.onComplete.add(function() {
														tween = game.add.tween(self.begin).to({
															angle: 0
														}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
														tween.onComplete.add(function() {
															tween = game.add.tween(self.begin.scale).to({
																x: gameConfig.scaleX * 1.2,
																y: gameConfig.scaleX * 1.2,
															}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
															tween.onComplete.add(function() {
																tween = game.add.tween(self.begin.scale).to({
																	x: gameConfig.scaleX,
																	y: gameConfig.scaleX,
																}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
															}, this);
														}, this);
													}, this);
												}, this);
											}, this);
										}, this);
									}, this);
								}, this);
							}, this);
						}, this);
					}, this);
				}, this);
			}, this);
		}, this);
	}
	this.addEmitterWeather = function() {
		var emitter = game.add.emitter(game.world.centerX, -100, 100);
		emitter.makeParticles(gameConfig.weatherArr[gameConfig.weather - 1]);
		emitter.setSize(game.width, 10);
		emitter.setAlpha(.2, .4);
		emitter.maxRotation = 0;
		emitter.minRotation = 0;
		emitter.start(false, 5000, 400, 0);
	}
	this.vanish = function() {
		var self = this;
		var tween = game.add.tween(self.tr).to({
			y: -self.tr.height,
			alpha: 0
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.tl).to({
			y: -self.tl.height,
			alpha: 0
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.title).to({
			alpha: 0
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.title.scale).to({
			x: gameConfig.scaleX * 1.3,
			y: gameConfig.scaleX * 1.3
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.build).to({
			alpha: 0,
			y: game.world.height
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.build.scale).to({
			x: gameConfig.scaleX * 1.3,
			y: gameConfig.scaleX * 1.3
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.btnGroup).to({
			alpha: 0,
			y: game.world.height
		}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.begin.scale).to({
			x: gameConfig.scaleX * 1.3,
			y: gameConfig.scaleX * 1.3
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween = game.add.tween(self.begin).to({
			alpha: 0,
		}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
		tween.onComplete.add(function() {
			game.state.add('Main', Main);
			game.state.start('Main');
		}, this);
	}
	this.update = function() {

	}
	this.render = function() {

	}
	this.minit = function() {
		this.addTrCloud();
		this.addTlCloud();
		this.addTitle();
		this.addBottomBtn();
		this.addBuild();
		this.addStart();
		this.addEmitterWeather();
	}
}

function Main(game) {
	var player = null,
		starGroup, foodGroup, lineGroup, addOk = true,
		nowSpeed = startSpeed = 0,
		goH = gameConfig.defaultPosition,
		onceEmitter = true,
		oneScore = true,
		tweenTime = null;
	this.init = function() {

	}
	//Create Game
	this.create = function() {
		gameConfig.revive == false ? gameConfig.score = 0 : '';
		//Open the physical engine and set gravity, collision and bounce.
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.restitution = 0;
		game.physics.p2.applySpringForces = false;
		game.physics.p2.gravity.y = gameConfig.gravity;
		//Draw the background
		game.add.sprite(0, 0, drawBackground(this.game, game.width, game.height, 0x7d6ddd, 0xed8ad0));
		starGroup = game.add.group();
		foodGroup = game.add.group();
		lineGroup = game.add.group();
		//Specified collision
		game.physics.p2.setPostBroadphaseCallback(this.checkCollide, this);
		//Add food and set the shape to open the physical engine.
		this.addFood(game.world.centerX, game.world.centerY, game.rnd.integerInRange(0, 1) > 0 ? -1 : 1);
		this.addFood(game.world.centerX, gameConfig.distance, game.rnd.integerInRange(0, 1) > 0 ? -1 : 1);
		player = this.addRole(game.world.centerX, game.world.height - 200);
		var self = this;
		game.input.onDown.add(function() {
			tweenTime.stop();
			var tween = game.add.tween(self.hand).to({
				alpha: 0
			}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0);
			tween = game.add.tween(self.handCir).to({
				alpha: 0
			}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0);
			player.body.velocity.y = -gameConfig.gravity / 2.3;
			startSpeed = gameConfig.gravity / 2.3; //Start speed
			player.body.onBeginContact.add(function(b, x) {
				if(b != null && b.sprite.name == gameConfig.dtip) { //This is a collision with the elements in the middle
					nowSpeed = Math.abs(player.body.velocity.y); //Now speed
					goH = Math.floor(nowSpeed * gameConfig.defaultPosition / startSpeed);
					foodGroup.forEachAlive(function(pos) {
						game.add.tween(pos.body).to({
							y: pos.y + goH //The distance should also be calculated, and the time should also be calculated, not every time it rises so much.
						}, 200 * nowSpeed / startSpeed, Phaser.Easing.Linear.InOut, true, 0, 0);
						game.add.tween(starGroup.children[foodGroup.getChildIndex(pos)].body).to({
							y: starGroup.children[foodGroup.getChildIndex(pos)].y + goH
						}, 200 * nowSpeed / startSpeed, Phaser.Easing.Linear.InOut, true, 0, 0);
						//The bottom line moves
						game.add.tween(lineGroup.children[0].body).to({
							y: lineGroup.children[0].y + goH
						}, 200 * nowSpeed / startSpeed, Phaser.Easing.Linear.InOut, true, 0, 0);
					});
				} else if((b == null) || (b.sprite.name == gameConfig.foodName && b != null && b.sprite.name != gameConfig.dtipBottom && b.sprite.key != 'star' && b.sprite.name != gameConfig.dtip)) { //和元素碰撞以及边界碰撞
					player.kill();
					if(onceEmitter) {
						onceEmitter = false;
						self.addEmitter(player.x, player.y);
					}
					game.time.events.add(Phaser.Timer.SECOND*3, function () {
						game.state.add('Main', Main);
						game.state.start('Main');
			        }, this);
					console.log('Game Over!!!'); 
				}
			})
		})
		//An object drawing an obscured element
		this.addLine();
		this.addLineCenter();
		this.addPhoto('photo', 'aicode');
		this.scoreTip(0);
		this.addHands();
	}
	//Collision restriction
	this.checkCollide = function(body1, body2) {
		//Line boundary collision
		if((body1.sprite.name == gameConfig.dtip && body2.sprite.key == 'player') || (body1.sprite.name == gameConfig.dtipBottom && body2.sprite.key == 'player') || (body2.sprite.name == gameConfig.dtip && body1.sprite.key == 'player') || (body2.sprite.name == gameConfig.dtipBottom && body1.sprite.key == 'player')) {
			return true; //Back to true, collision detection will occur
		} else if((body1.sprite.key == 'star' && body2.sprite.key == 'player') || (body2.sprite.key == 'star' && body1.sprite.key == 'player')) { //添加消失动画，加分
			if(oneScore) {
				oneScore = false;
				if(body1.sprite.key == 'star') {
					body1.sprite.play('disappear', 15, false, true);
					game.time.events.add(Phaser.Timer.SECOND * .6, function() {
						oneScore = true;
						body1.sprite.kill();
					}, this)
				} else {
					body2.sprite.play('disappear', 15, false, true);
					game.time.events.add(Phaser.Timer.SECOND * .6, function() {
						oneScore = true;
						body2.sprite.kill();
					}, this)
				}
				gameConfig.score += 1;
				this.scoreTip(gameConfig.score);
			}
			return false;
		} else if((body1.sprite.name == gameConfig.foodName && body2.sprite.key == 'player') || (body2.sprite.name == gameConfig.foodName && body1.sprite.key == 'player')) {
			return true;
		}
		return false;
	}
	//Add Role
	this.addRole = function(x, y) {
		//Add roles and set up its physical engine, and the online speed of each click.
		var o = game.add.sprite(0, 0, 'player');
		o.anchor.set(.5);
		o.x = x;
		o.y = y;
		game.physics.p2.enable(o, false);
		o.body.setCircle(o.width / 2);
		o.body.angularVelocity = 0;
		o.body.angularForce = 0;
		startHeight = o.y;
		endHeight = o.y;
		return o;
	}
	//Add Food
	this.addFood = function(x, y, deg) {
		var rnd = game.rnd.integerInRange(0, gameConfig.food.length - 1);
		var sprite = game.add.sprite(0, 0, gameConfig.food[rnd]);
		sprite.y = foodGroup.children.length > 0 ? foodGroup.getChildAt(foodGroup.children.length - 1).y - y - sprite.height : game.world.centerY - sprite.height / 2.5;
		sprite.x = x;
		sprite.anchor.set(.5);
		game.physics.p2.enable(sprite, false);
		sprite.body.static = true;
		this.addStar(sprite.x, sprite.y);
		sprite.body.clearShapes();
		sprite.body.loadPolygon('physics', gameConfig.food[rnd]);
		sprite.name = gameConfig.foodName;
		game.add.tween(sprite.body).to({
			rotation: deg * 2 * Math.PI
		}, gameConfig.speed, Phaser.Easing.Linear.InOut, true, 0, -1);
		foodGroup.add(sprite)
	}
	//Bottom Line
	this.addLine = function() {
		var line = game.add.sprite(0, 0, 'line');
		line.anchor.set(.5);
		line.width = game.width;
		line.x = game.world.centerX;
		line.y = game.world.height - 200 + player.height / 2;
		line.alpha = 0;
		game.physics.p2.enable(line, false);
		line.body.static = true;
		line.name = gameConfig.dtipBottom;
		lineGroup.add(line);
	}
	//Central Line
	this.addLineCenter = function() {
		var line = game.add.sprite(0, 0, 'line');
		line.anchor.set(.5);
		line.width = game.width;
		line.x = game.world.centerX;
		line.y = game.world.centerY - line.height;
		line.name = gameConfig.dtip;
		line.alpha = 0;
		game.physics.p2.enable(line, false);
		line.body.static = true;
	}
	//update game
	this.update = function() {
		foodGroup.forEachAlive(function(pos) {
			if(pos.y > game.height + pos.height) {
				pos.kill(); //Kill the sprite
				addOk = true;
			}
		}, this)
		//Add element
		if(foodGroup.getFirstAlive().y > game.world.centerY + foodGroup.getFirstAlive().height / 2) {
			if(addOk) {
				addOk = false;
				this.addFood(game.world.centerX, gameConfig.distance, game.rnd.integerInRange(0, 1) > 0 ? -1 : 1);
			}
		}
		if(lineGroup.children[0].y > game.height + lineGroup.children[0].height) {
			lineGroup.children[0].kill();
		}
	}
	//Start
	this.addStar = function(x, y) {
		var star = game.add.sprite(0, 0, 'star');
		star.y = y;
		star.x = x;
		star.anchor.set(.5);
		game.physics.p2.enable(star, false);
		star.body.static = true;
		star.body.clearShapes();
		star.body.loadPolygon('physics', 'star');
		star.body.friction = 0;
		star.body.mass = 0;
		star.body.kinematic = false;
		star.body.angularVelocity = 0;
		star.body.angularForce = 0;
		star.body.inertia = 0;
		star.animations.add('disappear', [1, 2, 3, 4, 5, 6, 7, 8, 9]);
		game.add.tween(star).to({
			alpha: .5
		}, gameConfig.speed / 3, Phaser.Easing.Linear.InOut, true, 0, -1, true);
		game.add.tween(star.scale).to({
			'x': .8,
			'y': .8,
			alpha: .5
		}, gameConfig.speed / 3, Phaser.Easing.Linear.InOut, true, 0, -1, true);
		starGroup.add(star);
	}
	//Animated particles of death
	this.addEmitter = function(x, y) {
		var e = game.add.emitter(x, y, 20);
		e.makeParticles('player', 0, 20, true, false);
		e.setScale(.4, .3, .4, .3);
		e.minParticleSpeed.setTo(-200, -300);
		e.maxParticleSpeed.setTo(200, 100);
		e.start(false, 3000, true, 20);
	}
	//Adding gesture hints
	this.addHands = function() {
		var self = this;
		self.handCir = game.add.image(game.world.centerX, game.world.height - 100, 'handcir');
		self.handCir.anchor.set(.5);
		self.handCir.scale.set(gameConfig.scaleX / 2);
		self.hand = game.add.image(game.world.centerX + self.handCir.width / 4, self.handCir.y + self.handCir.height / 1.2, 'hand');
		self.hand.anchor.set(.5);
		self.hand.scale.set(gameConfig.scaleX / 2);
		tweenTime = game.time.create(true);
		tweenTime.loop(2500, function() {
			var tween = game.add.tween(self.hand).to({
				y: self.hand.y + 10
			}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
			tween = game.add.tween(self.hand.scale).to({
				x: gameConfig.scaleX / 1.8,
				y: gameConfig.scaleX / 1.8
			}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
			tween.onComplete.add(function() {
				tween = game.add.tween(self.hand.scale).to({
					x: gameConfig.scaleX / 2,
					y: gameConfig.scaleX / 2
				}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
				tween = game.add.tween(self.hand).to({
					y: self.hand.y - 10
				}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
				tween.onComplete.add(function() {
					tween = game.add.tween(self.handCir).to({
						alpha: 0
					}, 600, Phaser.Easing.Linear.InOut, true, 0, 0);
					tween = game.add.tween(self.handCir.scale).to({
						x: gameConfig.scaleX / 1.5,
						y: gameConfig.scaleX / 1.5
					}, 600, Phaser.Easing.Linear.InOut, true, 0, 0);
					tween.onComplete.add(function() {
						tween = game.add.tween(self.handCir).to({
							alpha: 1
						}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
						tween = game.add.tween(self.handCir.scale).to({
							x: gameConfig.scaleX / 2,
							y: gameConfig.scaleX / 2
						}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
					}, this)
				}, this)
			}, this)
		});
		tweenTime.start();
	}
	//Add head group
	this.addPhoto = function(img, txt) {
		this.photo = game.add.group();
		this.mask = game.add.graphics(60 * gameConfig.scaleX, 60 * gameConfig.scaleY).beginFill(0xf1b7a0, 1).drawCircle(0, 0, 70 * gameConfig.scaleX).endFill();
		this.photo.mask = this.mask;
		this.img = game.add.sprite(0, 0, img);
		this.img.width = 70 * gameConfig.scaleX;
		this.img.height = 70 * gameConfig.scaleX;
		this.img.x = 60 * gameConfig.scaleX;
		this.img.y = 60 * gameConfig.scaleY;
		this.img.anchor.set(.5);
		this.photo.add(this.img);
		this.name = game.add.text(this.img.x + this.img.width / 1.5, this.img.y, txt, {
			'fill': '#fff',
			'fontSize': 28 * gameConfig.scaleX + 'px',
			'font-family': 'Microsoft YaHei'
		});
		this.name.anchor.set(0, .5);
		this.name.strokeThickness = 1;
		this.name.stroke = '#5757fe';
	}
	//Result hints
	this.scoreTip = function(score) {
		var self = this;
		if(score == 0 || gameConfig.revive) {
			self.txt = game.add.text(game.width - 40 * gameConfig.scaleX, 60 * gameConfig.scaleY, '分', {
				'fill': '#fff',
				'fontSize': 26 * gameConfig.scaleX + 'px',
				'font-family': 'Microsoft YaHei'
			});
			self.txt.anchor.set(1, .5);
			self.txt.strokeThickness = 1;
			self.txt.stroke = '#5757fe';
			self.txt.y = 60 * gameConfig.scaleY + self.txt.height / 4;
			self.txt.fontWeight = 0;
			self.score = game.add.text(game.width - 45 * gameConfig.scaleX - self.txt.width, 60 * gameConfig.scaleY, '0', {
				'fill': '#fff',
				'fontSize': 60 * gameConfig.scaleX + 'px',
				'font-family': 'Microsoft YaHei'
			});
			self.score.anchor.set(1, .5);
			self.score.strokeThickness = 1;
			self.score.stroke = '#5757fe';
		} else {
			self.sY = self.score.y;
			self.score.text = score;
			var tween = game.add.tween(self.score).to({
				y: self.sY - 10
			}, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
			tween.onComplete.add(function() {
				tween = game.add.tween(self.score).to({
					y: self.sY
				}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
				tween.onComplete.add(function() {
					tween = game.add.tween(self.score).to({
						y: self.sY - 4
					}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
					tween.onComplete.add(function() {
						tween = game.add.tween(self.score).to({
							y: self.sY
						}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
						tween.onComplete.add(function() {
							tween = game.add.tween(self.score).to({
								y: self.sY - 2
							}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
							tween.onComplete.add(function() {
								tween = game.add.tween(self.score).to({
									y: self.sY
								}, 100, Phaser.Easing.Linear.InOut, true, 0, 0);
							}, this)
						}, this)
					}, this)
				}, this);
			}, this);
		}
	}
}
//Rankings
function Ranking(game) {
	this.init = function() {

	}

	this.preload = function() {

	}
	this.create = function() {
		game.add.sprite(0, 0, drawBackground(this.game, game.width, game.height, 0x7d6ddd, 0xed8ad0));
		this.addMountain();
		this.titleImg();
		this.changeBtn();
		this.rankingBox();
		this.backBtn();
	}
	this.addMountain = function() {
		this.mountain = game.add.sprite(0, 0, 'mountain');
		this.mountain.width = game.width;
		this.mountain.y = game.height - this.mountain.height;
	}

	this.titleImg = function() {
		this.rankingName = game.add.sprite(game.world.centerX, 200 * gameConfig.scaleY, 'rankingName');
		this.rankingName.scale.set(gameConfig.scaleX);
		this.rankingName.anchor.set(.5);
	}
	this.changeBtn = function() {
		this.changeBtnL = game.add.sprite(game.world.centerX, this.rankingName.y, 'friends1');
		this.changeBtnL.scale.set(gameConfig.scaleX);
		this.changeBtnL.anchor.set(.5);
		this.changeBtnL.y = this.rankingName.y + this.changeBtnL.height;
		this.changeBtnL.x = this.rankingName.x - this.changeBtnL.width / 2;
		this.changeBtnR = game.add.sprite(game.world.centerX, this.rankingName.y, 'world2');
		this.changeBtnR.scale.set(gameConfig.scaleX);
		this.changeBtnR.anchor.set(.5);
		this.changeBtnR.y = this.rankingName.y + this.changeBtnL.height;
		this.changeBtnR.x = this.rankingName.x + this.changeBtnR.width / 2;
		game.world.setChildIndex(this.changeBtnL, 3);
		game.world.setChildIndex(this.changeBtnR, 4);
		this.changeBtnL.inputEnabled=true;
		this.changeBtnR.inputEnabled=true;
		this.changeBtnL.events.onInputDown.add(function(){
			this.changeBtnL.loadTexture('friends1');
			this.changeBtnR.loadTexture('world2');
			this.scoreGroup.removeAll();
			this.addScoreList();//Call data for friend ranking
		},this);
		this.changeBtnR.events.onInputDown.add(function(){
			this.changeBtnL.loadTexture('friends2');
			this.changeBtnR.loadTexture('world1');
			this.scoreGroup.removeAll();
			this.addScoreList();//Calls for world ranking data
		},this);
	}
	//Ranking box
	this.rankingBox = function() {
		this.rankingBox = game.add.sprite(game.world.centerX, this.changeBtnL.y, 'rankingBg');
		this.rankingBox.scale.set(gameConfig.scaleX);
		this.rankingBox.anchor.set(.5);
		this.rankingBox.y = this.changeBtnL.y + this.rankingBox.height / 2 + this.changeBtnL.height / 4 - 8 * gameConfig.scaleY;
		game.world.setChildIndex(this.rankingBox, 2);
		this.addScoreList(); //The default is data.

	}
	this.addScoreList=function(data){
		//Create a group and set up a mask.
		var w = this.rankingBox.width - 100 * gameConfig.scaleX;
		var h = this.rankingBox.height - 200 * gameConfig.scaleY;
		//Location mask location
		this.mask = game.add.graphics(game.world.centerX - this.rankingBox.width / 2 + 50 * gameConfig.scaleX, this.rankingBox.y - this.rankingBox.height / 2 + 100 * gameConfig.scaleY).beginFill(0xa0b5f1, 1).drawRect(0, 0, w, h).endFill();
		this.scoreGroup = game.add.group();
		this.scoreGroup.mask = this.mask;
		this.scoreGroup.x = game.world.centerX - this.rankingBox.width / 2 + 50 * gameConfig.scaleX;
		this.scoreGroup.y = this.rankingBox.y - this.rankingBox.height / 2 + 100 * gameConfig.scaleY;
		var rows = h / 5.2;
		/**********Place of name**********/
		for(var i = 0; i < 50; i++) {
			//Left name
			var listGroup = game.add.group();
			listGroup.height = rows;
			listGroup.x = 0;
			listGroup.y = rows * i;
			var txt = game.add.text(0, 0, (i + 1), {  //Status dynamics
				'fill': '#8553b0',
				'fontSize': 32 * gameConfig.scaleX + 'px',
				'font-family': 'Microsoft YaHei'
			});
			txt.strokeThickness = 1;
			txt.stroke = '#5757fe';
			txt.fontWeight = 0;
			txt.y = rows / 4+txt.height/4;
			txt.x = 0;
			listGroup.add(txt);
			//头像
			var photo = game.add.group();
			var mask1 = game.add.graphics(txt.x + txt.width + 50 * gameConfig.scaleX, rows / 2).beginFill(0xf1b7a0, 1).drawCircle(0, 0, 70 * gameConfig.scaleX).endFill();
			photo.mask = mask1;
			var img = game.add.sprite(0, 0, 'photo');  //Head image dynamics
			img.width = 70 * gameConfig.scaleX;
			img.height = 70 * gameConfig.scaleX;
			img.x = txt.x + txt.width + 50 * gameConfig.scaleX;
			img.y = rows / 2;
			img.anchor.set(.5);
			photo.add(img);
			listGroup.add(photo);
			listGroup.add(mask1);
			//Nickname?
			var txtName = game.add.text(0, 0, 'Keen', {   //Name dynamics
				'fill': '#8553b0',
				'fontSize': 28 * gameConfig.scaleX + 'px',
				'font-family': 'Microsoft YaHei'
			});
			txtName.strokeThickness = 1;
			txtName.stroke = '#5757fe';
			txtName.fontWeight = 0;
			txtName.y = rows / 4 + txtName.height / 4;
			txtName.x = img.x + img.width / 2 + 10 * gameConfig.scaleX;
			txtName.text = txtName.text.length > 7 ? txtName.text.substring(0, 7) + '...' : txtName.text;
			listGroup.add(txtName);

			//Right side fraction
			var scoreTxt = game.add.text(0, 0, '100', {   //Fractional dynamics
				'fill': '#ff3661',
				'fontSize': 32 * gameConfig.scaleX + 'px',
				'font-family': 'Microsoft YaHei'
			});
			scoreTxt.fontWeight = 0;
			scoreTxt.y = rows / 4+scoreTxt.height/4;
			scoreTxt.x = txt.x + w;
			scoreTxt.anchor.x = 1;
			listGroup.add(scoreTxt);
			this.scoreGroup.add(listGroup);
		}
		this.scorllList(this.scoreGroup,h,rows);
	}
	this.scorllList=function(groups,h,rows){
		//Sliding event
		this.isOkClick = false;
		this.startY = 0;
		var nowY = 0;
		game.input.onDown.add(function(pointer, x, y) {
			nowY = 0;
			this.startY = pointer.y;
			if(Math.abs(pointer.x - groups.x) < game.width / 2) this.isOkClick = true;
		}, this);
		game.input.onUp.add(function(pointer) { //Optimize the speed of leaving the region.
			if(groups.children.length==0)return;
			if(groups.children[0].y > 0) {
				for(var c = 0; c < groups.length; c++) {
					game.add.tween(groups.children[c]).to({
						y: rows * c
					}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
				}
			} else if(groups.children[groups.length - 1].y < h) {
				var __ = 0;
				for(var c = groups.length - 1; c >= 0; c--) {
					__++;
					game.add.tween(groups.children[c]).to({
						y: h - __ * rows
					}, 500, Phaser.Easing.Linear.InOut, true, 0, 0);
				}
			}
			this.isOkClick = false;
		}, this);
		game.input.addMoveCallback(function(pointer, x, y, isTap) {
			//The representative is in that area.
			if(!isTap && x > 0 && x < game.width && y > groups.y && y < game.height) {
				var yStart = 0;
				yStart = this.startY - y;
				groups.forEach(function(pointer) {
					var diffValue = yStart - nowY;
					pointer.y -= diffValue;
				})
				nowY = yStart;
			}
		}, this);
	}
	this.backBtn = function() {
		this.back = game.add.sprite(game.world.centerX, 0, 'back');
		this.back.scale.set(gameConfig.scaleX);
		this.back.anchor.set(.5);
		this.back.y = this.rankingBox.y + this.rankingBox.height / 2 + this.back.height / 2;
		this.back.inputEnabled=true;
		this.back.events.onInputDown.add(function(){
			 game.state.add('GameBegin',GameBegin);
			 game.state.start('GameBegin');
		});
	}
	this.update = function() {

	}
	this.render = function() {

	}
}

//Global background rendering method
function drawBackground(game, width, height, color1, color2) {
	var background = game.add.bitmapData(width, height);
	var step = height;
	var ractHeight = Math.floor(height / step);
	for(var i = 0; i <= step; i++) {
		var color = Phaser.Color.interpolateColor(color1, color2, step, i);
		background.rect(0, ractHeight * i, width, ractHeight, Phaser.Color.getWebRGB(color));
	}
	return background;
}
var game = new Phaser.Game(document.documentElement.clientWidth * 2, document.documentElement.clientHeight * 2, Phaser.CANVAS);
game.state.add('LoadGame', LoadGame);
game.state.start('LoadGame');