//This file handles all logic for the game within the React App//
//This includes GET and POST requests to the server where necessary//
const helper = require("./helper.js");
import * as PIXI from './pixiModule.js';

//Data from the React Component
let appData;

//Declare the variable so that after the texture is loaded, it can be reused.
let pickupTex;

//Bools that are tied to input
let leftInputPressed = false;
let rightInputPressed = false;
let topInputPressed = false;
let bottomInputPressed = false;

//Track the mouse position
const mousePosition = {x: 0, y: 0}

//The score for the current game session
let currentScore = 0;

let scoreDisplay;
let highScoreDisplay;

const gameOverEvent = new CustomEvent('gameOver');

//#region Input

//Updates the mouse position
const getMousePosition = (e) => {
    mousePosition.x = e.data.global.x;
    mousePosition.y = e.data.global.y;
};

//Player input
const playerInput = (player) => {
//Move the player around the screen
    if(leftInputPressed){
        player.x -= 5;
    }
    if(rightInputPressed){
        player.x += 5;
    }
    if(topInputPressed){
        player.y -= 5;
    }
    if(bottomInputPressed){
        player.y += 5;
    }

    player.rotation = Math.atan2((mousePosition.y - player.y), (mousePosition.x - player.x));
};

//Sets up the key events that will be tied to game functions
const setupInputEvents = () => {
    //Keydown
    document.onkeydown = (e) => {
        switch(e.key)
        {
            case 'a':
                leftInputPressed = true;
                break;
            case 's':
                bottomInputPressed = true;
                break;
            case 'd':
                rightInputPressed = true;
                break;
            case 'w':
                topInputPressed = true;
                break;
        }
    };
    //Keyup
    document.onkeyup = (e) => {
        switch(e.key)
        {
            case 'a':
                leftInputPressed = false;
                break;
            case 's':
                bottomInputPressed = false;
                break;
            case 'd':
                rightInputPressed = false;
                break;
            case 'w':
                topInputPressed = false;
                break;
        }
    };
};

//#endregion

//#region Helper Functions 

//Returns True or False depending on whether the boxes touch
/*AABB Method Code Adapted from Prof. Dower Chin's tutorial on PIXI.js Collision
Link: https://www.youtube.com/watch?v=-q_Zk5uxk7Q*/
const AABBCollision = (a, b) => {
    //validate that the objects exist, otherwise exit the function
    if(!a || !b) {
        return;
    }

    //Get required properties of objects
    let objA = a.getBounds();
    let objB = b.getBounds();

    //Make the 4 checks necessary to determine a collision
    return objA.x + objA.width > objB.x 
        && objA.x < objB.x + objB.width
        && objA.y + objA.height > objB.y
        && objA.y < objB.y + objB.height;
};

//Checks whether a player is in contact with an interactable object
const checkCollisions = (app, player, pickups, enemies) => {
    if(!player || pickups.length < 1 || !enemies) {
        return;
    }

    //Check Player against each Pickup
    for(let i = 0; i < pickups.length; i++) {
        if(AABBCollision(player, pickups[i])) {
            //Remove the sprite from the game and array
            app.stage.removeChild(pickups[i]);
            pickups.splice(i, 1);

            //Increment Score
            currentScore++;

            //FOR DEBUG PURPOSES
            //console.log(`Pickup acquired! Current Score: ${currentScore}`);

            //Add a new collectible to make up for the destroyed one
            respawnCollectible(app, pickups);
        }
    }

    //TODO: Check Player against each Enemy
    for(const enemy of enemies) {
        if(AABBCollision(player, enemy)) {
            gameOver(app, player, pickups, enemies);
            return;
        }
    }
};

/*This function is adapted from the code by "user4205678" on StackOverflow
that lets an object follow another- in this case i'm using it for enemies
Link: https://stackoverflow.com/questions/27533331/problems-making-enemy-follow-moving-player*/
const followPlayer = (enemies, player) => 
{
    //Make sure there are actually enemies to chase the player
    if(enemies.length < 1){
        return;
    }

    //Have each enemy move toward the player
    for(const enemy of enemies) {
        //Calculate distances + angles
        const xDistance = player.x - enemy.x;
        const yDistance = player.y - enemy.y;
        const distance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));

        //Adjust enemy properties accordingly
        enemy.angle = Math.atan2(yDistance, xDistance) * 180 / Math.PI;
        enemy.x += Math.floor(Math.random() * 6) * (xDistance / distance);
        enemy.y += Math.floor(Math.random() * 6) * (yDistance / distance);
    }
}

//Spawns a new collectible (assumes that the texture has already been loaded)
const respawnCollectible = (app, pickups) => {
    //Make sure the texture has already been loaded
    if (!pickupTex) {
        return;
    }

    //Create a new Sprite
    const pickupSprite = new PIXI.Sprite(pickupTex);
 
    pickupSprite.scale = {x:0.1, y:0.1};

    pickupSprite.x = Math.floor(Math.random() * (app.renderer.width - 100));
    pickupSprite.y = Math.floor(Math.random() * (app.renderer.height - 100));

    pickupSprite.anchor.x = 0.5;
    pickupSprite.anchor.y = 0.5;

    app.stage.addChild(pickupSprite);
    pickups.push(pickupSprite);
};

//clears the app of all sprites
const gameOver = (app, player, pickups, enemies) => {

    document.dispatchEvent(gameOverEvent);

    //delete player
    app.stage.removeChild(player);

    //delete pickups
    for(let i = 0; i < pickups.length; i++){
        app.stage.removeChild(pickups[i]);
        pickups.splice(i, 1);
    }

    //delete enemies
    for(let i = 0; i < enemies.length; i++){
        app.stage.removeChild(enemies[i]);
        enemies.splice(i, 1);
    }

    saveData(currentScore);
};

//Saves current score as high score if it is higher
const saveData =  (score) => {
    //console.log("IN SAVEDATA in PIXI.JS");
    helper.sendPost("/saveScore", {score: score, _csrf: appData.csrfToken});
};

//#endregion

//#region Setup
const getPlayerData = async () => {
    //console.log("getting player data...")
    const dbData = await fetch("/getCurrentPlayerData");
    const dbDataJSON = await dbData.json();

    //console.log(dbDataJSON);

    if(dbDataJSON){
        highScoreDisplay.innerHTML = `High Score: ${dbDataJSON.highScore}`;
    } else {
        highScoreDisplay.innerHTML = `High Score: 0`;
    }
};

//RETURNS A SPRITE OBJECT IN THE SCENE//
const setupPlayer = async (app) => {
    //Sprite Setup
    const texture = await PIXI.Assets.load('/assets/img/topDownSprite.png');
    const playerSprite = new PIXI.Sprite(texture);

    //Properties
    playerSprite.scale = {x:0.3, y:0.3};

    playerSprite.x = app.renderer.width/2;
    playerSprite.y = app.renderer.height/2;

    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;

    app.stage.addChild(playerSprite);

    return playerSprite;
};

const setupBackground = async (app) => {
    //Background is its own sprite
    const bgTex = await PIXI.Assets.load('/assets/img/darkBackground.jpg');
    const bg = new PIXI.TilingSprite(bgTex, window.innerWidth, window.innerHeight);

    //Edit background properties
    bg.position.set(0,0);
    bg.interactive = true;
    bg.on("mousemove", getMousePosition);

    app.stage.addChild(bg);

    return bg;
};

const setupCollectibles = async (app, numCollectibles) => {
     //Pickup Sprites
     const pickups = [];

     //only load the pickup texture once
     pickupTex = await PIXI.Assets.load('/assets/img/coin.png');

     for (let i = 0; i < numCollectibles; i++) {
        const pickupSprite = new PIXI.Sprite(pickupTex);
 
        pickupSprite.scale = {x:0.1, y:0.1};
    
        pickupSprite.x = Math.floor(Math.random() * (app.renderer.width - 100));
        pickupSprite.y = Math.floor(Math.random() * (app.renderer.height - 100));

        pickupSprite.anchor.x = 0.5;
        pickupSprite.anchor.y = 0.5;
    
        app.stage.addChild(pickupSprite);
        pickups.push(pickupSprite);
     }

     return pickups;
};

const setupEnemies = async (app, numEnemies) => {
    const enemies  = [];

    const enemyTex = await PIXI.Assets.load('/assets/img/monster.jpg');

    for (let i = 0; i <= numEnemies; i++) {
        const enemySprite = new PIXI.Sprite(enemyTex);
 
        enemySprite.scale = {x:0.1, y:0.1};
    
        enemySprite.x = Math.floor(Math.random() * (app.renderer.width - 100));
        enemySprite.y = Math.floor(Math.random() * (app.renderer.height - 100));

        enemySprite.anchor.x = 0.5;
        enemySprite.anchor.y = 0.5;
    
        app.stage.addChild(enemySprite);
        enemies.push(enemySprite);
     }

     return enemies;
};

//#endregion

//#region Main Methods

//Render/Game loop
const loop = (app, player, pickups, enemies) => {
    app.ticker.add(() => {
        //Update the score on the screen
        scoreDisplay.innerHTML = `Score: ${currentScore}`;

        //Update Player based on input
        playerInput(player);

        //Have enemies follow the player
        followPlayer(enemies, player);

        //Check for Collisions
        checkCollisions(app, player, pickups, enemies);

    });
};

//Create the app and begin the render loop
const initApp = async (data) => {
    console.log("Starting app...")
    appData = data;

    const app = new PIXI.Application({ width: window.innerWidth, height: 600 });
    document.getElementById('gameArea').appendChild(app.view);

    //Draw Order: Background, Player, Pickups, Enemies;
    await setupBackground(app);

    //Player Object
    const playerSprite = await setupPlayer(app);

    //Pickups
    const pickups = await setupCollectibles(app, 3);

    //Enemies
    const enemies = await setupEnemies(app, 1);

    //Complete setup and start loop
    setupInputEvents();

    scoreDisplay = document.getElementById('score');
    highScoreDisplay = document.getElementById("highScore");

    await getPlayerData();

    loop(app, playerSprite, pickups, enemies);
};

//#endregion

export { gameOverEvent, initApp }