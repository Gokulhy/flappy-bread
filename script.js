let board;
let boardwidth=350;
let boardheight=640;
let context;

let tryAgainButton = document.getElementById("try-again");

//bird
let birdwidth=44;
let birdheight=44;
let birdx=boardwidth/8;
let birdy=boardheight/2;

let bird={
    x:birdx,
    y:birdy,
    width:birdwidth,
    height:birdheight
}

//pipes
let pipearray=[];
let pipewidth=64;
let pipeheight=512;
let pipex=boardwidth;
let pipey=0;

let toppipeimg;
let bottompipeimg;

let velocityx=-1.5;
let velocity=0;
let gravity=0.1;

let gameover;
let score=0;
 
window.onload=()=>{
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");

    //image
    birdimg=new Image();
    birdimg.src="./images/f7f450dd20e3cd466d8225f9c0c8e5e7.png"
    birdimg.onload=()=>{
        context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    }

    toppipeimg=new Image();
    toppipeimg.src="./images/pipe-downward.png";


    bottompipeimg=new Image();
    bottompipeimg.src="./images/pipe.png";

    requestAnimationFrame(update);
    setInterval(placepipes,1800);
    document.addEventListener("click",movebird);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height)

    velocity+=gravity;
    bird.y=Math.max(bird.y+velocity,0);
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);

    if (bird.y > board.height) {
        gameover = true;
    }

    for(let i=0;i<pipearray.length;i++){
        let pipe=pipearray[i];
        pipe.x+=velocityx;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        
        if(detect(bird,pipe)){
            gameover=true;
        }

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }
    }
      //clear pipes
    while (pipearray.length > 0 && pipearray[0].x < -pipewidth) {
        pipearray.shift(); //removes first element from the array
    }
    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameover) {
        context.fillText("GAME OVER", 5, 90);
        tryAgainButton.style.display = "block"; // Show the button
    } else {
        tryAgainButton.style.display = "none"; // Hide the button
    }
}

function placepipes(){
    if(gameover){
        return;
    }

    let openingspace=board.height/3.2;
    let randompipey=pipey-pipeheight/4-Math.random()*(pipeheight/2);

    let toppipe={
    img: toppipeimg,
    x:pipex,
    y:randompipey,
    height:pipeheight,
    width:pipewidth,
    passed:false
    }
    pipearray.push(toppipe);

    let bottompipe={
        img: bottompipeimg,
        x:pipex,
        y:randompipey+pipeheight+openingspace,
        height:pipeheight,
        width:pipewidth,
        passed:false
    }
    pipearray.push(bottompipe);
}

function movebird(e){
    velocity=-5;

    if (gameover) {
        bird.y = birdy;
        pipearray = [];
        score = 0;
        gameover = false;
    }
}

function detect(a,b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

tryAgainButton.addEventListener("click", () => {
    bird.y = birdy;
    pipearray = [];
    score = 0;
    gameover = false;
    tryAgainButton.style.display = "none"; // Hide the button again
});
