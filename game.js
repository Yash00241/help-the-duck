const playerChar = "p";
const wallChar = "1";
const backgroundChar = ".";

setMap(map`
.......w
.......w
.......w
.p......
.......w
.......w
.......w
.......w` );
setBackground(backgroundChar);

let opening = 3;
let speed = 250;
let score = 0;
let isGameOver = false;

setPushables({
  [playerChar]: [],
});

onInput("s", () => {
  if (!isGameOver) {
    const player = getFirst(playerChar);
    player.y += 1;
    if (player.y > 7) player.y = 7; 
  }
});

onInput("w", () => {
  if (!isGameOver) {
    const player = getFirst(playerChar);
    player.y -= 1;
    if (player.y < 0) player.y = 0; 
  }
});

function genWall() {
  opening = Math.floor(Math.random() * 8);
  for (let y = 0; y < 8; y++) {
    if (y !== opening) {
      addSprite(7, y, wallChar);
    }
  }

  score++;
}

function gameLoop() {
  addText(`Score: ${score}`, {x: 9, y: 14, color: color`F`});
    
  getAll(wallChar).forEach((w) => {
    if (w.x === 0) {
      w.remove();
    } else {
      w.x -= 1;
    }
  });

  if (getAll(wallChar).length === 0) {
    genWall();
  }

  const player = getFirst(playerChar);
  const walls = getAll(wallChar);
  const collision = walls.some(w => w.x === player.x && w.y !== opening);
  
  if (collision) {
    lost();
  } 

  speed = Math.max(100, speed - (250 - speed)); 
  if (!isGameOver) {
    setTimeout(gameLoop, speed);
  }
}

function lost() {
  isGameOver = true;
  setMap(map`
........
........
........
........
........
........
........
........`);
  clearText();
  addText("Game over!", {x: 5, y: 7, color: color`C`});
  addText(`Score: ${score}`, {x: 5, y: 8, color: color`4`});
}

gameLoop();
