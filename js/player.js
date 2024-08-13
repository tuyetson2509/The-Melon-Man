game.player = {
		x: 54,
		y: 0,
		height: 24,
		highestY: 0,
		direction: "left",
		isInAir: false,
		startedJump: false,
		canDoubleJump: false,
		moveInterval: null,
		fallTimeout: function(startingY, time, maxHeight) {
			console.log("Fall Timeout Started");  // Debugging
			setTimeout(function () {
			  console.log("Current Y: " + this.y);  // Debugging
			  if (this.isInAir) {
				this.y = startingY - maxHeight + Math.pow((-time / 3 + 11), 2);
				if (this.y < this.highestY) {
				  this.highestY = this.y;
				}
				if (time > 37) {
				  this.startedJump = false;
				  game.checkCollisions();
				}
				if (time < 150) {
				  time++;
				  this.fallTimeout(startingY, time, maxHeight);
				} else {
				  game.isOver = true;
				}
				if (this.y > 40) {
				  game.isOver = true;
				}
				game.requestRedraw();
			  }
			}.bind(this, startingY, time, maxHeight), 12);
		  }
		  ,
		animationFrameNumber: 0,
		collidesWithGround: true,
		animations: {
			// Describe coordinates of consecutive animation frames of objects in textures
			left: [{tileColumn: 4, tileRow: 0}, {tileColumn: 5, tileRow: 0}, {tileColumn: 4, tileRow: 0}, {tileColumn: 6, tileRow: 0}],
			right: [{tileColumn: 9, tileRow: 0}, {tileColumn: 8, tileRow: 0}, {tileColumn: 9, tileRow: 0}, {tileColumn: 7, tileRow: 0}]
		},
		jumpCount: 0,
		jump: function (type) {
			if (!this.isInAir) {  // First jump
				clearInterval(this.fallInterval);
				game.sounds.jump.play();
				this.isInAir = true;
				this.startedJump = true;
				this.canDoubleJump = true;  // Enable double jump
	
				var startingY = this.y;
				var time = 1;
				maxHeight = 121;
				this.fallTimeout(startingY, time, maxHeight);
	
			} else if (this.canDoubleJump) {  // Double jump
				clearInterval(this.fallInterval);
				game.sounds.jump.play();
				this.canDoubleJump = false;  // Use up the double jump
	
				// Immediate upward movement for smooth double jump
				var startingY = this.y;
				var time = 1;
				maxHeight = 80;  // Adjust maxHeight for a smaller double jump
				this.y -= 20;  // Immediate upward boost
				this.fallTimeout(startingY, time, maxHeight);
			}
		}
	}
