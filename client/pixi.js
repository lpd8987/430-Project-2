//This file handles all logic for the game within the React App//

import * as PIXI from './pixiModule.js';

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

//Render/Game loop
const loop = (app, player, pickups) => {
    app.ticker.add(() => {
        //Update Player based on input
        playerInput(player);

        //Check for Collisions
        checkCollisions(app, player, pickups);
    });
};

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

//#region Setup and Helper Functions 

//HELPERS//

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

const checkCollisions = (app, player, pickups) => {
    if(!player || pickups.length < 1) {
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

            console.log(`Pickup acquired! Current Score: ${currentScore}`);

            //Add a new collectible to make up for the destroyed one
            respawnCollectible(app, pickups);
        }
    }

    //TODO: Check Player against each Enemy

};

//Spawns a new collectible (assumes that the texture has already been loaded)
const respawnCollectible = (app, pickups) => {
    //Make sure the texture has already been loaded
    if (!pickupTex) {
        return;
    }

    const pickupSprite = new PIXI.Sprite(pickupTex);
 
    pickupSprite.scale = {x:0.1, y:0.1};

    pickupSprite.x = Math.floor(Math.random() * app.renderer.width);
    pickupSprite.y = Math.floor(Math.random() * app.renderer.height);

    pickupSprite.anchor.x = 0.5;
    pickupSprite.anchor.y = 0.5;

    app.stage.addChild(pickupSprite);
    pickups.push(pickupSprite);
};

//SETUP//

//Returns a Sprite object after loading the proper texture;
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
    const bg = new PIXI.Sprite(bgTex);

    //Edit background properties
    bg.scale = {x: 2, y: 2};
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
    
        pickupSprite.x = Math.floor(Math.random() * app.renderer.width);
        pickupSprite.y = Math.floor(Math.random() * app.renderer.width);

        pickupSprite.anchor.x = 0.5;
        pickupSprite.anchor.y = 0.5;
    
        app.stage.addChild(pickupSprite);
        pickups.push(pickupSprite);
     }

     return pickups;
};

const setupEnemies = () => {

};

//#endregion


//Create the app and begin the render loop
const initApp = async () => {
    const app = new PIXI.Application();
    document.getElementById('gameArea').appendChild(app.view);

    //Draw Order: Background, Player, Pickups, Enemies;
    await setupBackground(app);

    //Player Object
    const playerSprite = await setupPlayer(app);

    //Pickups
    const pickups = await setupCollectibles(app, 3);

    //Enemies
    setupEnemies();

    //Complete setup and start loop
    setupInputEvents();

    loop(app, playerSprite, pickups);
};

export { initApp }