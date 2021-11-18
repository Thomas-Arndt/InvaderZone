// Variables

var gameOn = true;

var delta = 0;

var gameSpeed = 1;

var backgroundPosition = -6000;

var weaponCharged = true;

var playerOne = {
    left: 400,
    top: 620,
    velocity: {x: 0, y: 0},
    score: 0,
    life: 3,
    attack: 1,
    shield: false
};

var enemies = [];

var wave = [];

var missiles = [];

var energyBalls = [];

var boxes = [];

// Functions	

function moveBackground(){
    var background = document.getElementById("starfield");
    //if(backgroundPosition >= 0){
    //	backgroundPosition = -6000;
    //	background.style.top = backgroundPosition+'px';
    //}
    if(backgroundPosition < 0){
        backgroundPosition += 1.5;
        background.style.top = backgroundPosition+'px';
    }
}

function drawPlayer(){
    if(playerOne.shield){
        var playerContent = "<div class='shield' style='left:"+playerOne.left+"px; top:"+playerOne.top+"px; '></div>";
    }
    else{
        var playerContent = "<div class='playerOne' style='left:"+playerOne.left+"px; top:"+playerOne.top+"px; '></div>";
    }
    
        document.getElementById("players").innerHTML = playerContent;
}	

function drawEnemies(){
    var enemyContent = "";

    for(var eid=0; eid<enemies.length; eid++){
        enemyContent += "<div class='"+enemies[eid].type+"' style='left:"+enemies[eid].position.left+"px; top:"+enemies[eid].position.top+"px; transform: rotate("+(enemies[eid].angle*57)+"deg);'></div>";
    }
    document.getElementById("enemies").innerHTML = enemyContent;
}

function spawnSphere(pointA, pointB, pointC, pointD, pointE){
    var deltaX = pointB.left - pointA.left;
    var deltaY = pointA.top - pointB.top;
    var angleStart = Math.atan2(deltaY, deltaX);
    var velocityX = 10*Math.cos(angleStart);
    var velocityY = -10*Math.sin(angleStart);
    enemies.push({position: {left: pointA.left, top: pointA.top}, 
                    pointA: {left: pointA.left, top: pointA.top}, 
                    pointB: {left: pointB.left, top: pointB.top}, 
                    pointC: {left: pointC.left, top: pointC.top}, 
                    pointD: {left: pointD.left, top: pointD.top}, 
                    pointE: {left: pointE.left, top: pointE.top}, 
                    destination: {left: pointB.left, top: pointB.top}, 
                    active: 1, 
                    type: "enemy2", 
                    life: 5, 
                    reward: 50,
                    velocity: {x: velocityX, y: velocityY}, 
                    angle: 0, 
                    seqPointer: delta,
                    seqStage: 1,
                    seqFinalStage: 8,
                    roundCount: 0}
                );
}

function spawnStarfighter(pointA, pointB){
    var deltaX = pointB.left - pointA.left;
    var deltaY = pointA.top - pointB.top;
    var angleStart = Math.atan2(deltaY, deltaX);
    var velocityX = 10*Math.cos(angleStart);
    var velocityY = -10*Math.sin(angleStart);
    enemies.push({position: {left: pointA.left, top: pointA.top}, 
                    pointA: {left: pointA.left, top: pointA.top}, 
                    pointB: {left: pointB.left, top: pointB.top}, 
                    destination: {left: pointB.left, top: pointB.top},
                    active: 1, 
                    type: "enemy1", 
                    life: 1, 
                    reward: 10,
                    velocity: {x: velocityX, y: velocityY}, 
                    angle: (-angleStart)-90, 
                    seqPointer: delta,
                    seqStage: 1,
                    seqFinalStage: 4,
                    roundCount: 0}
                );
}

function arrivals(){
    for (var eid = 0; eid<enemies.length; eid++){
        if(enemies[eid].active == 1){
            if(Math.abs(enemies[eid].destination.left-enemies[eid].position.left) <= 5 && Math.abs(enemies[eid].destination.top-enemies[eid].position.top) <= 5){
                enemies[eid].velocity.x = 0;
                enemies[eid].velocity.y = 0;
                var deltaX = playerOne.left- enemies[eid].position.left;
                var deltaY = playerOne.top - enemies[eid].position.top;
                var angleNew = Math.atan2(deltaY, deltaX);
                if(enemies[eid].type == "enemy1"){
                    enemies[eid].angle = angleNew - 90;
                }
            }
        }
    }
}

function starfighterSequence(){
    for(var eid=0; eid<enemies.length; eid++){
        if(enemies[eid].type=="enemy1" && enemies[eid].active==1){
            if(Math.abs(enemies[eid].destination.left-enemies[eid].position.left) <= 5 && Math.abs(enemies[eid].destination.top-enemies[eid].position.top) <= 5){
                if(enemies[eid].seqStage == 1){
                    enemies[eid].seqStage = 2;
                    enemies[eid].seqPointer = delta;
                }
                else if(enemies[eid].seqStage == 2 && delta >= enemies[eid].seqPointer+250){
                    enemies[eid].destination = enemies[eid].pointA;
                    var deltaX = enemies[eid].destination.left - enemies[eid].pointB.left;
                    var deltaY = enemies[eid].pointB.top - enemies[eid].destination.top;
                    var angleNew = Math.atan2(deltaY, deltaX);
                    var velocityX = 10*Math.cos(angleNew);
                    var velocityY = -10*Math.sin(angleNew);
                    enemies[eid].velocity.x = velocityX;
                    enemies[eid].velocity.y = velocityY;
                    enemies[eid].angle = angleNew+90;
                    enemies[eid].seqStage = 3;
                }
            }
            if(Math.abs(enemies[eid].destination.top-enemies[eid].position.top) > 5){
                if(enemies[eid].seqStage == 3){
                    enemies[eid].seqStage = 4;
                }
            }
        }
    }
}	

function sphereSequence(){
    for(var eid=0; eid<enemies.length; eid++){
        if(enemies[eid].type == "enemy2" && enemies[eid].active == 1){
            if(Math.abs(enemies[eid].destination.left-enemies[eid].position.left) <= 5 && Math.abs(enemies[eid].destination.top-enemies[eid].position.top) <= 5){
                if(enemies[eid].seqStage == 1){
                    enemies[eid].seqStage = 2;
                    enemies[eid].seqPointer = delta;
                    enemies[eid].roundCount = 0;
                }
                else if(enemies[eid].seqStage == 2 && delta >= enemies[eid].seqPointer+150){
                    enemies[eid].destination = enemies[eid].pointC;
                    var deltaX = enemies[eid].destination.left - enemies[eid].pointB.left;
                    var deltaY = enemies[eid].pointB.top - enemies[eid].destination.top;
                    var angleNew = Math.atan2(deltaY, deltaX);
                    var velocityX = 10*Math.cos(angleNew);
                    var velocityY = -10*Math.sin(angleNew);
                    enemies[eid].velocity.x = velocityX;
                    enemies[eid].velocity.y = velocityY;
                    //enemies[eid].angle = angleNew+90;
                    enemies[eid].seqStage = 3;
                }
                else if(enemies[eid].seqStage == 3){
                    enemies[eid].seqStage = 4;
                    enemies[eid].seqPointer = delta;
                    enemies[eid].roundCount = 0;
                }
                else if(enemies[eid].seqStage == 4 && delta >= enemies[eid].seqPointer+150){
                    enemies[eid].destination = enemies[eid].pointD;
                    var deltaX = enemies[eid].destination.left - enemies[eid].pointC.left;
                    var deltaY = enemies[eid].pointC.top - enemies[eid].destination.top;
                    var angleNew = Math.atan2(deltaY, deltaX);
                    var velocityX = 10*Math.cos(angleNew);
                    var velocityY = -10*Math.sin(angleNew);
                    enemies[eid].velocity.x = velocityX;
                    enemies[eid].velocity.y = velocityY;
                    //enemies[eid].angle = angleNew+90;
                    enemies[eid].seqStage = 5;
                }
                else if(enemies[eid].seqStage == 5){
                    enemies[eid].seqStage = 6;
                    enemies[eid].seqPointer = delta;
                    enemies[eid].roundCount = 0;
                }
                else if(enemies[eid].seqStage == 6 && delta >= enemies[eid].seqPointer+150){
                    enemies[eid].destination = enemies[eid].pointE;
                    var deltaX = enemies[eid].destination.left - enemies[eid].pointD.left;
                    var deltaY = enemies[eid].pointD.top - enemies[eid].destination.top;
                    var angleNew = Math.atan2(deltaY, deltaX);
                    var velocityX = 10*Math.cos(angleNew);
                    var velocityY = -10*Math.sin(angleNew);
                    enemies[eid].velocity.x = velocityX;
                    enemies[eid].velocity.y = velocityY;
                    //enemies[eid].angle = angleNew+90;
                    enemies[eid].seqStage = 7;
                }
            }
            if(Math.abs(enemies[eid].destination.left-enemies[eid].position.left) > 5 || Math.abs(enemies[eid].destination.top-enemies[eid].position.top) > 5){
                if(enemies[eid].seqStage == 7){
                    enemies[eid].seqStage = 8;
                }
            }
        }
    }
}

function movePlayer(){
    if((playerOne.left+playerOne.velocity.x+70) < 890 && (playerOne.left+playerOne.velocity.x) > 10){
        playerOne.left += playerOne.velocity.x;
    }
    else{
        playerOne.velocity.x = 0;
    }
    if((playerOne.top+playerOne.velocity.y+75) < 740 && (playerOne.top+playerOne.velocity.y) > 10){
        playerOne.top += playerOne.velocity.y;
    }
    else{
        playerOne.velocity.y = 0;
    }
}

function moveEnemies(){
    sphereSequence();
    starfighterSequence();
    arrivals();
    for(var eid=0; eid<enemies.length; eid++){
        enemies[eid].position.top += enemies[eid].velocity.y;
        enemies[eid].position.left += enemies[eid].velocity.x;
    }
}

function blasterFire(){
    if(playerOne.attack < 3){ // Level one attack
            missiles.push({left: (playerOne.left+31), top: (playerOne.top-12), velocity: {x: 0, y: -25}, active: 1});
        }
        else if(playerOne.attack < 6){ // Level two attack
            missiles.push({left: (playerOne.left+15), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+47), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
        }
        else if(playerOne.attack < 9){ // Level three attack
            missiles.push({left: (playerOne.left+31), top: (playerOne.top-12), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+15), top: (playerOne.top+35), velocity: {x: -4, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+47), top: (playerOne.top+35), velocity: {x: 4, y: -25}, active: 1});
        }
        else if(playerOne.attack < 12){ // Level four attack
            missiles.push({left: (playerOne.left+15), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+47), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+15), top: (playerOne.top+35), velocity: {x: -6, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+47), top: (playerOne.top+35), velocity: {x: 6, y: -25}, active: 1});
        }
        else if(playerOne.attack >= 12){ // Level five attack
            missiles.push({left: (playerOne.left+15), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+47), top: (playerOne.top+35), velocity: {x: 0, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+20), top: (playerOne.top+25), velocity: {x: -5, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+42), top: (playerOne.top+25), velocity: {x: 5, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+5), top: (playerOne.top+50), velocity: {x: -9, y: -25}, active: 1});
            missiles.push({left: (playerOne.left+56), top: (playerOne.top+50), velocity: {x: 9, y: -25}, active: 1});
        }
        weaponCharged = false;
        setTimeout(blasterRecharge, 125);
}

function moveMissiles(){
    for(var mid=0; mid<missiles.length; mid++){
        missiles[mid].left += missiles[mid].velocity.x;
        missiles[mid].top += missiles[mid].velocity.y;
    }
}

function returnFire(){ 
    for(var eid=0; eid<enemies.length; eid++){
        var deltaX = playerOne.left - enemies[eid].position.left;
        var deltaY = playerOne.top - enemies[eid].position.top;
        var angle = Math.atan2(deltaY, deltaX);
        var speedX = 8*Math.cos(angle);
        var speedY = 8*Math.sin(angle);
        
        if(enemies[eid].type == "enemy1" && enemies[eid].active == 1){ // Starfighters
            if(enemies[eid].seqStage == 2){
                if((delta-enemies[eid].seqPointer) >= (enemies[eid].roundCount*60)){
                    energyBalls.push({left: (enemies[eid].position.left+22), 
                                        top: (enemies[eid].position.top+52), 
                                        active: 1, 
                                        velocity : {x: speedX, y: speedY}}
                                    );
                    enemies[eid].roundCount++;
                }
            }
        }
        if(enemies[eid].type == "enemy2" && enemies[eid].active == 1){ // Starfighters
            if(enemies[eid].seqStage == 2 || enemies[eid].seqStage == 4 || enemies[eid].seqStage == 6){
                if((delta-enemies[eid].seqPointer) >= (enemies[eid].roundCount*75)){
                    energyBalls.push({left: (enemies[eid].position.left+22), 
                                        top: (enemies[eid].position.top+52), 
                                        active: 1, 
                                        velocity : {x: speedX, y: speedY}}
                                    );
                    energyBalls.push({left: (enemies[eid].position.left+22), 
                                        top: (enemies[eid].position.top+52), 
                                        active: 1, 
                                        velocity : {x: 8*Math.cos(angle-0.25), y: 8*Math.sin(angle-0.25)}}
                                    );
                    energyBalls.push({left: (enemies[eid].position.left+22), 
                                        top: (enemies[eid].position.top+52), 
                                        active: 1, 
                                        velocity : {x: 8*Math.cos(angle+0.25), y: 8*Math.sin(angle+0.25)}}
                                    );
                    enemies[eid].roundCount++;
                }
            }
        }
    }
}

function drawProjectiles(){
    var projectileContent = "";
    for(var idx=0; idx<missiles.length; idx++){
        projectileContent += '<div class="missile" style="left:'+missiles[idx].left+'px; top:'+missiles[idx].top+'px; transform: rotate('+missiles[idx].angle+'deg)"></div>';
    }
    document.getElementById('missiles').innerHTML = projectileContent;
    projectileContent = "";
    for(var idx=0; idx<energyBalls.length; idx++){
        projectileContent += '<div class="energyBall" style="left:'+energyBalls[idx].left+'px; top:'+energyBalls[idx].top+'px"></div>';
    }
    document.getElementById('energyballs').innerHTML = projectileContent;
}

function moveEnergyBalls(){
    for(var eid=0; eid<energyBalls.length; eid++){
        energyBalls[eid].top += energyBalls[eid].velocity.y;
        energyBalls[eid].left += energyBalls[eid].velocity.x;
    }
}

function drawBoxes(){
    var boxContent = "";

    for(var idx=0; idx<boxes.length; idx++){
        if(boxes[idx].type == 1){
            boxContent += "<div class='redBox' style='left:"+boxes[idx].left+"px; top:"+boxes[idx].top+"px;'></div>";
        }
        else if(boxes[idx].type == 2){
            boxContent += "<div class='blueBox' style='left:"+boxes[idx].left+"px; top:"+boxes[idx].top+"px;'></div>";
        }
        else if(boxes[idx].type == 3){
            boxContent += "<div class='purpleBox' style='left:"+boxes[idx].left+"px; top:"+boxes[idx].top+"px;'></div>";
        }
    }
    document.getElementById("boxes").innerHTML = boxContent;
}

function moveBoxes(){
    for(var idx=0; idx<boxes.length; idx++){
        boxes[idx].top += 5*gameSpeed;
    }
}

function boxDrop(left,top){
    var chance = Math.floor(Math.random()*100);
    if(chance < 10){ // Drop extra life
        boxes.push({left: (left+31), top: (top-12), type: 3, active: 1});
    }
    else if(chance >= 10 && chance < 40){ // Drop shield
        boxes.push({left: (left+31), top: (top-12), type: 2, active: 1});
    }
    else if(chance >= 40 && chance < 100){ // Drop weapon upgrade
        boxes.push({left: (left+31), top: (top-12), type: 1, active: 1});
    }

}

function clearInactive(){
    for(var eid=0; eid<enemies.length; eid++){ // Inactive enemies
        if(enemies[eid].active == 0){
            enemies.splice(eid,1);
        }
    }
    for(var mid=0; mid<missiles.length; mid++){ // Inactive missiles
        if(missiles[mid].active == 0){
            missiles.splice(mid,1);
        }
    }
    for(var eid=0; eid<energyBalls.length; eid++){ // Inactive energy balls
        if(energyBalls[eid].active == 0){
            energyBalls.splice(eid,1);
        }
    }
    for(var bid=0; bid<boxes.length; bid++){ // Inactive boxes
        if(boxes[bid].active == 0){
            boxes.splice(bid,1);
        }
    }
    for(var eid=0; eid<enemies.length; eid++){
        if(enemies[eid].top > 750){ // Enemies leaving starfield
            enemies.splice(eid,1);
        }
    }
    for(var eid=0; eid<energyBalls.length; eid++){ // Energyballs leaving starfield
        if(energyBalls[eid].top > 750){
            energyBalls.splice(eid,1);
        }
    }
    for(var bid=0; bid<boxes.length; bid++){ // Boxes leaving starfield
        if(boxes[bid].top > 750){
            boxes.splice(bid,1);
        }
    }
    for(var mid=0; mid<missiles.length; mid++){
        if(missiles[mid].top < -12 || missiles[mid].left < -12 || missiles[mid].left > 900){ // Missiles leaving starfield
            missiles.splice(mid,1);
        }
    }
}

function eventCheck(){
    for(var eid=0; eid<enemies.length; eid++){ // Check each enemy for events
        if(enemies[eid].seqStage == enemies[eid].seqFinalStage){ // Check if enemies have reached final stage of their sequence
            if(Math.abs(enemies[eid].destination.left-enemies[eid].position.left) <= 5 && Math.abs(enemies[eid].destination.top-enemies[eid].position.top) <= 5){
                enemies[eid].active = 0;

            }
        }
        for(var mid=0; mid<missiles.length; mid++){ // Check for collision with missile
            if(missiles[mid].left >= (enemies[eid].position.left+3) && missiles[mid].left <= (enemies[eid].position.left+67)){
                if((missiles[mid].top+12) >= (enemies[eid].position.top+3) && missiles[mid].top <= (enemies[eid].position.top+72)){
                    enemies[eid].life--;
                    missiles[mid].active = 0;
                    if(enemies[eid].life == 0){
                        enemies[eid].active = 0;
                        playerOne.score += enemies[eid].reward;
                        if(enemies[eid].type == "enemy2"){
                            boxDrop(enemies[eid].position.left, enemies[eid].position.top);
                        }
                    }
                }
            }
        }
        if((playerOne.left+31) >= (enemies[eid].position.left) && (playerOne.left+31) <= (enemies[eid].position.left+70)){ 
            if((playerOne.top+70) >= (enemies[eid].position.top+5) && playerOne.top <= (enemies[eid].position.top+55)){ // Player collides with enemy ship
                enemies[eid].active = 0;
                if(!playerOne.shield){
                    playerOne.life--;
                    enemies[eid].life--;
                    playerOne.attack -= 3;
                    if(playerOne.attack< 1){
                        playerOne.attack = 1;
                    }
                    playerOne.left = 400;
                    playerOne.top = 620;
                    if(enemies[eid].life == 0){
                        enemies[eid].active = 0;
                        playerOne.score += enemies[eid].reward;
                        if(enemies[eid].type == "enemy2"){
                            boxDrop(enemies[eid].position.left, enemies[eid].position.top);
                        }						
                    }
                }
                drawPlayer();
                drawEnemies();
                clearInactive();
            }
        }
    }
    for(var eid=0; eid<energyBalls.length; eid++){
        if((playerOne.left+55) >= energyBalls[eid].left && (playerOne.left+15) <= (energyBalls[eid].left+25)){ 
            if((playerOne.top+65) >= energyBalls[eid].top && (playerOne.top+35) <= (energyBalls[eid].top+25)){ // Player collides with energy ball
                energyBalls[eid].active = 0;
                if(!playerOne.shield){
                    playerOne.life--;
                    playerOne.attack -= 3;
                    if(playerOne.attack < 1){
                        playerOne.attack = 1;
                    }
                    playerOne.left = 400;
                    playerOne.top = 620;
                }
                drawPlayer();
                drawEnemies();
                clearInactive();
                updateHud();
            }
        }
    }
    for(var bid=0; bid<boxes.length; bid++){
        if((playerOne.left+55) >= boxes[bid].left && (playerOne.left+15) <= (boxes[bid].left+50)){ 
            if((playerOne.top+65) >= boxes[bid].top && (playerOne.top+35) <= (boxes[bid].top+50)){ // Player collides with box
                boxes[bid].active = 0;
                if(boxes[bid].type == 1){ // Upgrade weapons level or give points for max weapons
                    if(playerOne.attack < 12){
                        playerOne.attack++;
                    }
                    else{
                        playerOne.score+=50;
                    }
                }
                else if(boxes[bid].type == 2){ // Activate shield
                    if(playerOne.shield){
                        playerOne.score+=50;
                    }
                    else{
                        playerOne.shield = true;
                        setTimeout(shieldEnd, 10000);
                    }
                }
                else if(boxes[bid].type == 3){ // Regain one life
                    if(playerOne.life < 5){
                        playerOne.life++;
                    }
                    else{
                        playerOne.score += 50;
                    }
                    
                }
                drawPlayer();
                drawBoxes();
                clearInactive();
                updateHud();
            }
        }
    }

    if(playerOne.life<=0){
        gameOver();
    }

}

function shieldEnd(){
    playerOne.shield=false;
}

function blasterRecharge(){
    weaponCharged = true;
}

function updateHud(){
    var hudContent = "";
    for(var idx=1; idx<=playerOne.life; idx++){
        hudContent += "<div class='life'></div>";
    }
    document.getElementById("livesDisplay").innerHTML = hudContent;
    document.getElementById("scoreDisplay").innerHTML = '<div id="scoreDisplay">'+playerOne.score+'</div>';
}

function gameOver(){
    gameOn = false;
    document.getElementById("centerMessage").innerHTML = "Game Over";
    document.getElementById("centerMessage").style.visibility = "visible";
    playerOne.left = -99;
    playerOne.top == -99;
    drawPlayer();
    drawEnemies();
    drawProjectiles();
    clearInactive();
}

// Choreography

function choreography(){
    if(delta == 25){
        spawnStarfighter({left: 100, top: -65}, {left: 100, top: 300});
    }
    if(delta == 60){
        spawnStarfighter({left: 600, top: -65}, {left: 600, top: 250});
    }
    if(delta == 85){
        spawnSphere({left:-120, top:100}, {left:200, top:200}, {left:450, top:100}, {left:200, top:100}, {left:-120, top:100})
    }
    if(delta == 110){
        spawnStarfighter({left: 540, top: -65}, {left: 540, top: 150});
    }
    if(delta == 350){
        spawnStarfighter({left: 680, top: -65}, {left: 680, top: 150});
    }
    if(delta == 395){
        spawnStarfighter({left: 100, top: -65}, {left: 100, top: 300});
    }
}

//Game Loop

function gameLoop(){
    moveBackground();

    movePlayer();
    drawPlayer();

    choreography();

    moveEnemies();
    drawEnemies();

    
    moveMissiles();
    moveEnergyBalls();
    drawProjectiles();

    moveBoxes();
    drawBoxes();
    
    eventCheck();

    clearInactive();

    returnFire();

    updateHud();

    delta++;

    if(gameOn){
        setTimeout(gameLoop, (gameSpeed*30));
    }
    
}

// Gameplay

document.onkeydown = function(e){
    //console.log(e);
    
    if(e.key == "a" && gameOn){ // Left
        playerOne.velocity.x = -10;
    }
    else if(e.key == "d" && gameOn){ // Right
        playerOne.velocity.x = 10;
    }
    else if(e.key == "w" && gameOn){ // Up
        playerOne.velocity.y = -10;
    }
    else if(e.key == "s" && gameOn){ // Down
        playerOne.velocity.y = 10;
    }
    if(e.key == " " && gameOn && weaponCharged){ // Fire
        blasterFire();
    }
    if(e.key == "Escape"){ // Pause gameloop
        if(gameOn){
            gameOn = false;
            document.getElementById("centerMessage").innerHTML = "Paused";
            document.getElementById("centerMessage").style.visibility = "visible";
        }
        else{
            gameOn = true;
            document.getElementById("centerMessage").style.visibility = "hidden";
            gameLoop();
        }
    }
    drawPlayer();
}

document.onkeyup = function(e){
    //console.log(e);
    if(e.key == "a" && gameOn){ // Left
        playerOne.velocity.x = 0;
    }
    if(e.key == "d" && gameOn){ // Right
        playerOne.velocity.x = 0;
    }
    if(e.key == "w" && gameOn){ // Up
        playerOne.velocity.y = 0;
    }
    if(e.key == "s" && gameOn){ // Down
        playerOne.velocity.y = 0;
    }
    drawPlayer();
}

// Initialization

gameLoop(); // Run game