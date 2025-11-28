const board = document.querySelector('.board')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const startBtn = document.querySelector(".btn-start")
const restartBtn = document.querySelector(".btn-restart")

const highScoreElement = document.querySelector(".high-score")
const scoreElement = document.querySelector(".score")
const timeElement = document.querySelector(".time")

const blockHeight = 30
const blockWidth = 30

let highScore = localStorage.getItem("highScore") || 0
let score = 0
let time = `00-00`

const rows = Math.floor(board.clientHeight / blockHeight)
const cols = Math.floor(board.clientWidth / blockWidth)

let intervalId = null
let timerIntervalId = null

let direction = "right"

let food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}

const blocks = [];
let snake = [
  {
    x:1, y:3
  },{
    x:1, y:4
  },{
    x:1, y:5
  }
];

for (let row = 0; row < rows ; row++) {
  for(let col = 0; col < cols ; col++) {
    const block = document.createElement('div')
    block.classList.add("block")
    board.appendChild(block)
    blocks[ `${row}-${col}` ] = block
  }
}

function render() {
  let head = null
  
  blocks[ `${food.x}-${food.y}`].classList.add("food")

  if (direction === "left") {
    head = {x:snake[0].x, y:snake[0].y-1}
  }else if(direction === "right") {
    head = {x:snake[0].x, y:snake[0].y+1}
  }else if(direction === "down") {
    head = {x:snake[0].x+1, y:snake[0].y}
  }else if(direction === "up") {
    head = {x:snake[0].x-1, y:snake[0].y}
  }

  //wall collision logic
  if(head.x <0 || head.x >= rows || head.y <0 ||head.y >= cols){
    modal.style.display ="flex"
    startGameModal.style.display = "none"
    gameOverModal.style.display = "flex"
    clearInterval(intervalId)
  }

  //food consume logic
  if(head.x == food.x && head.y == food.y){
    blocks[ `${food.x}-${food.y}`].classList.remove("food")
    food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}
    blocks[ `${food.x}-${food.y}`].classList.add("food")

    snake.unshift(head)

    score += 1
    scoreElement.innerHTML = score

    if (score > highScore) {
      highScore = score
      localStorage.setItem("highScore", highScore)
    }
    highScoreElement.innerHTML = highScore

  }

  snake.forEach(segment => {
    blocks[ `${segment.x}-${segment.y}` ].classList.remove("fill")
  })

  snake.unshift(head)
  snake.pop()
  snake.forEach(segment => {
    blocks[ `${segment.x}-${segment.y}` ].classList.add("fill")
  })

};

startBtn.addEventListener("click", () => {
  modal.style.display = "none"
  intervalId = setInterval(() => {render() },300)
  timerIntervalId = setInterval (() => {
    let [min, sec] = time.split("-").map(Number)

    if(sec==59){
      min+=1
      sec=0
    }else{
      sec+=1
    }

    time = `${min}-${sec}`
    timeElement.innerHTML = time
  }, 1000)
});

restartBtn.addEventListener("click", restartGame)

//restart game logic
function restartGame(){

  scoreElement.innerHTML = 0
  score = 0
  time = '00-00'

  modal.style.display = "none"
  blocks[ `${food.x}-${food.y}`].classList.remove("food")

  food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}
    snake = [
    {
      x:1, y:3
    },{
      x:1, y:4
    },{
      x:1, y:5
    }
  ]
  direction = "right"
  intervalId = setInterval(() => {render() },300)

}

addEventListener("keydown", (event) => {
  if(event.key === "ArrowUp"){
    direction = "up"
  }else if(event.key === "ArrowRight"){
    direction = "right"
  }else if(event.key === "ArrowLeft"){
    direction = "left"
  }else if(event.key === "ArrowDown"){
    direction = "down"
  }
});