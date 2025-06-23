window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loadingScreen').style.display = 'none';
      document.getElementById('gameContainer').style.display = 'flex';
      resizeCanvas();
    }, 2000);
  });

  // Variables
  let inputDir = { x: 0, y: 0 };
  const scoreBox = document.getElementById('scoreBox');
  const restartBtn = document.getElementById('restartBtn');
  let speed = 5;
  let score = 0;
  let lastPainttime = 0;
  let snakeArr = [{ x: 13, y: 15 }];
  let food = { x: 6, y: 7 };

  // Particle System
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  window.addEventListener('resize', resizeCanvas);
  function resizeCanvas() {
    const rect = document.getElementById('board').getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 1;
      this.speedY = (Math.random() - 0.5) * 1;
      this.alpha = 1;
      this.color = `hsl(${Math.random() * 50 + 180}, 100%, 60%)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.01;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  let particles = [];
  function emitParticles(headX, headY) {
    const rect = document.getElementById('board').getBoundingClientRect();
    const cellSize = rect.width / 18;
    for (let i = 0; i < 5; i++) {
      const x = (headX - 1) * cellSize + cellSize / 2;
      const y = (headY - 1) * cellSize + cellSize / 2;
      particles.push(new Particle(x, y));
    }
  }
  function handleParticles() {
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    });
  }

  // Game Loop
  function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPainttime) / 1000 < 1 / speed) return;
    lastPainttime = ctime;
    gameEngine();
  }

  function iscollide(sarr) {
    for (let i = 1; i < sarr.length; i++) {
      if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) return true;
    }
    if (sarr[0].x >= 18 || sarr[0].x <= 0 || sarr[0].y >= 18 || sarr[0].y <= 0) return true;
    return false;
  }

  function gameEngine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (iscollide(snakeArr)) {
      inputDir = { x: 0, y: 0 };
      restartBtn.style.display = "block";
      return;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
      snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
      food = { x: Math.floor(2 + Math.random() * 16), y: Math.floor(2 + Math.random() * 16) };
      score++;
      speed += 0.1;
      scoreBox.innerHTML = "Score: " + score;
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
      snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    const board = document.getElementById('board');
    board.querySelectorAll('.snake, .head, .food').forEach(e => e.remove());

    snakeArr.forEach((e, index) => {
      const element = document.createElement('div');
      element.style.gridRowStart = e.y;
      element.style.gridColumnStart = e.x;
      if (index === 0) {
        element.classList.add('head');
      } else {
        element.classList.add('snake');
      }
      board.appendChild(element);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    emitParticles(snakeArr[0].x, snakeArr[0].y);
    handleParticles();
  }

  //Main Logic Starts here;
  let hiscore = localStorage.getItem('hiscore');
  if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem('hiscore', JSON.stringify(hiscoreval))

  }
  else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High score: " + hiscoreval;

  }

  window.requestAnimationFrame(main);

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case "ArrowUp": if (inputDir.y !== 1) inputDir = { x: 0, y: -1 }; break;
      case "ArrowDown": if (inputDir.y !== -1) inputDir = { x: 0, y: 1 }; break;
      case "ArrowLeft": if (inputDir.x !== 1) inputDir = { x: -1, y: 0 }; break;
      case "ArrowRight": if (inputDir.x !== -1) inputDir = { x: 1, y: 0 }; break;
    }
  });

  restartBtn.addEventListener("click", () => {
    snakeArr = [{ x: 13, y: 15 }];
    food = { x: 6, y: 7 };
    score = 0;
    speed = 5;
    scoreBox.innerHTML = "Score: 0";
    restartBtn.style.display = "none";
  });
