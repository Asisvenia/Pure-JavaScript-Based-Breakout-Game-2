
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var img = document.getElementById('f1');

var x, y, dx, dy, ex, ey, eyd, ballRadiusX, ballRadius, paddleWidth, paddleHeight, paddleX, leftPressed, rightPressed, cKeyPressed, brickWidth, brickHeight, bricksColumn, bricksRow, topOffset, leftOffset, bricks, brickPadding, lives, score, randX;


//
function randX(max, min) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var result = Math.floor(Math.random()*(max - min)) + min;
	if (result === -3 || result === 0 || result === 1) {
		result = -2;
	}
	return result;
}

console.log(randX(5, -4));

x = canvas.width/2 ;
y = canvas.height - 30;
dx = randX(5, -4);
dy = -3.5;
ballRadius = 20;
paddleWidth = 150;
paddleHeight = 20;
paddleX = (canvas.width-paddleWidth)/2; // 437
leftPressed = false;
rightPressed = false;
cKeyPressed = false;
brickWidth = 125;
brickHeight = 45;
bricksColumn = 6;
bricksRow = 7;
topOffset = 55;
leftOffset = 110;
brickPadding = 20;
lives = 3;
score = 0;
ex = 150;
ey = canvas.width - 10;
ballRadiusX = 30;
eyd = -8;


bricks = [];

for(c = 0; c < bricksColumn; c++) {
	bricks[c] = [];
	for(r = 0; r < bricksRow; r++) {
		bricks[c][r] = {x: 0, y: 0, status: 1, colorCheck: true};
	}
}


document.addEventListener('keydown', keyTrueHandler);
document.addEventListener('keyup', keyFalseHandler);

function keyTrueHandler(e) {
	if(e.keyCode === 37) {
		leftPressed = true;
	} else if(e.keyCode === 39) {
		rightPressed = true;
	} else if (e.keyCode === 67) {
		cKeyPressed = true;
	}
};

function keyFalseHandler(e) {
	if(e.keyCode === 37) {
		leftPressed = false;
	} else if(e.keyCode === 39) {
		rightPressed = false;
	}
};


function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = '#0CA6E8';
	ctx.fill();
	ctx.closePath();
};

function drawExtraBall() {
	ctx.beginPath();
	ctx.arc(ex, ey, ballRadiusX, 0, Math.PI*2);
	ctx.fillStyle = '#02F205';
	ctx.fill();
	ctx.closePath();
};

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-20, paddleWidth, paddleHeight);
	ctx.fillStyle = '#054BFF';
	ctx.fill();
	ctx.closePath();
};

function drawLives() {
	ctx.beginPath();
	ctx.font = '20px Arial';
	ctx.fillText('Lives:', 202, 25);
	ctx.fillStyle = 'blue';
	ctx.closePath();
};

function drawScore() {
	ctx.beginPath();
	ctx.font = '20px Arial';
	ctx.fillText('Score: ' + score, canvas.width - 250, 25);
	ctx.fillStyle = 'blue';
	ctx.closePath();
};

function drawImg() {
	if(lives === 1 || lives === 2 || lives === 3) {
	ctx.drawImage(img, 260, 7, 25, 25);
}

};


function drawSecImg() {
	if(lives === 2 || lives === 3) {
	ctx.drawImage(img, 290, 7, 25, 25);
}
};

function drawThirdImg() {
	if(lives === 3) {
	ctx.drawImage(img, 320, 7, 25, 25);
}

};


var color;

function drawBrick() {
	for(c = 0; c < bricksColumn; c++) {
		for(r = 0; r < bricksRow; r++) {
			if(bricks[c][r].status == 1) {
			
			var brickX = (c*(brickWidth+brickPadding))+leftOffset;
			var brickY = (r*(brickHeight+brickPadding))+topOffset;

			bricks[c][r].x = brickX;
			bricks[c][r].y = brickY;

			ctx.beginPath();
			ctx.rect(brickX, brickY, brickWidth, brickHeight);

			if(bricks[c][r].colorCheck === true) {
				color = '#3986FF';
				bricks[c][r].status = 1;
			} else if (bricks[c][r].colorCheck === false) {
				color = '#BD0000';
				bricks[c][r].status = 0;
			}


			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
			}
		}
	}
};

function collisionDetect() {
		for(c = 0; c < bricksColumn; c++) {
		for(r = 0; r < bricksRow; r++) {
			var b = bricks[c][r];

			if(b.status == 1) {
				
				// EX- EY
				if( ex > b.x && ey < b.y + brickHeight) {
				b.colorCheck = false;
				score++;
				}
				
				// X - Y
				if(x > b.x - ballRadius && x < b.x + brickWidth + ballRadius && y > b.y - ballRadius && y < b.y + brickHeight + ballRadius) {
				dy = -dy;
				b.colorCheck = false;
				score++;
				}

			}
		}
	}

	if(score === bricksColumn * bricksRow) {
		alert('You win! CONGS!');
		document.location.reload();
	}


};

// MAIN FUNCTION //
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBrick();
	collisionDetect();
	drawImg();
	drawSecImg();
	drawThirdImg();
	drawLives();
	drawScore();
	drawExtraBall();

	// Change direction
	// For X:
	if(x > canvas.width - ballRadius || x < 20) {
		dx = -dx;
	}

	// For Y:
	if(y < 20) {
		dy = -dy;
	} else if (y > canvas.height - ballRadius) {
		if(x > paddleX && x < paddleX+paddleWidth) {

		dy = -dy;
		} else {
			lives--;
			
			if(lives === 0) {
		setTimeout(function(){
			alert('Game Over!');
		}, 50);

				setTimeout(function(){
					document.location.reload();
					lives = 3;
		}, 51);
		
			} else {
				x = canvas.width/2;
				y = canvas.height - 30;
				dx = randX(5, -4);
				dy = -3.5;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	};

	// Controller
	if(leftPressed && paddleX > 0) {
		paddleX -= 7;
	} else if (rightPressed && paddleX < 872) {
		paddleX += 7;
	} else if (cKeyPressed) {
		ey += eyd;
	}
	

	x += dx;
	y += dy;

requestAnimationFrame(draw);
}

document.addEventListener('keypress', spaceKeyHandler);

var counter = 0;

function spaceKeyHandler(e) {
	counter ++;
	if(e.keyCode === 32) {
		dx = 6.5;
		dy = -6.5;
	}
		if (counter === 2) {
		dx = randX(5, -4);
		dy = -3.5;
		counter = 0;
	}
};


document.addEventListener('mousemove', mouseController);

function mouseController(e) {

var relativeX = e.clientX - canvas.offsetLeft;

	if(relativeX > 60 && relativeX < canvas.width - 50) {
		paddleX = relativeX - paddleWidth/2;
	}

};

draw();