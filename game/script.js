// Referências do documento HTML
const body = document.getElementById("body");
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const clouds = document.querySelector(".clouds");
const screenGameBoard = document.querySelector(".game-board");
const screenGameStart = document.getElementById('game-start');
const screenGameOver = document.getElementById('game-over');
const screenScore = document.getElementById('score');
const screenLifes = document.getElementById('lifes');
const audioSoundtrack = document.getElementById('audio-soundtrack');
const audioJump = document.getElementById('audio-jump');
const audioDamage = document.getElementById('audio-damage');
const audioGameOver = document.getElementById('audio-game-over');

audioJump.volume = 0.25;

// Variáveis de controle
let onAir;
let onGame;
let canStart = true;
let canRestart;
let lifes;
let score;
let removePipe;

// Evento de carregamento para mostrar tela inicial
document.addEventListener("DOMContentLoaded", () => {
    screenGameStart.style.display = "flex";
});

// Evento de apertar tecla para iniciar
document.addEventListener("keydown", event => {
    if (event.code === "Enter" && canStart === true) {
        screenGameStart.style.display = "none";
        startAndRestart();
    }
});

// Evento de apertar tecla para pular
document.addEventListener("keydown", event => {
    if (event.code === "Space" && onAir === false && onGame === true) {
        jump();
    }
});

// Evento de apertar tecla para recomeçar
document.addEventListener("keydown", event => {
    if (event.code === "KeyR" && onGame === false && canRestart === true) {
        startAndRestart();
    }
});

// Função de tocar determinado áudio
function playAudio(audio) {
    if (audio === "soundtrack") {
        audioGameOver.pause();
        audioSoundtrack.currentTime = 0;
        audioSoundtrack.play();

    } else if (audio === "jump") {
        audioJump.currentTime = 0;
        audioJump.play();

    } else if (audio === "damage") {
        audioDamage.currentTime = 0;
        audioDamage.play();

    } else {
        audioSoundtrack.pause();
        audioJump.pause();
        audioDamage.pause();
        audioGameOver.currentTime = 0;
        audioGameOver.play();
    }
}

// Função de iniciar pontuação e vidas
function startScoreLife() {
    score = 0;
    lifes = 3;
}

// Função de mostrar pontuação e vidas
function showScoreLife() {
    screenScore.textContent = "SCORE: " + score;
    screenLifes.textContent = "LIFES: " + lifes;
}

// Função de iniciar e recomeçar
function startAndRestart() {
    playAudio("soundtrack");

    canStart = false;
    onAir = false;
    onGame = true;

    screenGameOver.style.display = "";

    clouds.classList.add("clouds-animation");
    clouds.style.left = "";
    
    mario.src = "../img/mario-run.gif";
    mario.style.width = "";
    mario.style.bottom = "";
    mario.style.marginLeft = "";

    startScoreLife();
    showScoreLife();
    loopScore();
    loopCreatePipe();
}

// Função de pular
function jump() {
    playAudio("jump");
    mario.src = "../img/mario-jump.png";
    mario.style.width = "78px";
    mario.style.marginLeft = "38px";
    mario.classList.add("jump");
    onAir = true;

    setTimeout(() => {
        if (onGame) {
            mario.src = "../img/mario-run.gif";
            mario.style.width = "";
            mario.style.marginLeft = "";
        }
        mario.classList.remove("jump");
        onAir = false;
    }, 500);
}

// Função de atualizar pontuação
function updateScore(points) {
    score += points;
}

// Função com loop de acrescentar pontuação
function loopScore() {
    const loopUpdateScore = setInterval(() => {
        if (onGame) {
            updateScore(100);
            showScoreLife();
        } else {
            clearInterval(loopUpdateScore);
        } 
    }, 1000);
}

// Função de criar o cano com sua respectiva velocidade
function createPipe(speed) {
    let newPipe = document.createElement("img");
    newPipe.src = "../img/pipe.png";
    newPipe.classList.add("pipe");
    newPipe.classList.add(`pipe-animation-${speed}`);
    screenGameBoard.appendChild(newPipe);
    loopVerifyCollision(newPipe);
    
    let speedRemove;
    if (speed === 1) {
        speedRemove = 1500;

    } else if (speed === 2) {
        speedRemove = 2000;

    } else {
        speedRemove = 2500;
    }

    const pipe = document.querySelector(`.pipe-animation-${speed}`);
    removePipe = setTimeout(() => {
        pipe.remove();
    }, speedRemove);
}

// Função com loop de criação de canos
function loopCreatePipe() {
    const loopCreation = setInterval(() => {
        if (onGame) {
            let speedPipe = Math.ceil(Math.random() * 3);
            createPipe(speedPipe);
        } else {
            clearInterval(loopCreation);
        }
    }, 2550);
}

// Função de verificar colisão entre o cano criado e o mario
function loopVerifyCollision(pipe) {
    let lostLife = false;
    
    const loopVerification = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const cloudsPosition = clouds.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
    
        // Verificação de dano
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 85 && lifes > 0) {
            if (!lostLife) {
                playAudio("damage");
                lifes--;
                lostLife = true;
                
                updateScore(-100);
                showScoreLife();

                mario.style.opacity = 0.4
                setTimeout(() => {
                    mario.style.opacity = 1;
                }, 300);

                setTimeout(() => {
                    lostLife = false;
                }, 300);
            }
        }

        // Verificação de fim de jogo
        if (lifes <= 0) {
            playAudio("gameover");

            pipe.classList.remove("pipe-animation");
            pipe.style.left = pipePosition + "px";
            
            mario.classList.remove("jump");
            mario.style.bottom = marioPosition + "px";
            mario.src = "../img/mario-over.png";
            mario.style.width = "80px";
            mario.style.marginLeft = "40px";
    
            clouds.classList.remove("clouds-animation");
            clouds.style.left = cloudsPosition + "px";
    
            onGame = false;
            canRestart = false;
            
            loopCreatePipe();
            loopScore();
            clearTimeout(removePipe);
            clearInterval(loopVerification);

            setTimeout(() => {
                pipe.remove();
                canRestart = true;
                screenGameOver.style.display = "flex";
            }, 3250);
        }
    }, 10);
}