//CODE FROM https://pixijs.io/customize/
//export * from '@pixi/constants';
//export * from '@pixi/math';
//export * from '@pixi/runner';
//export * from '@pixi/settings';
//export * from '@pixi/ticker';
//export * from '@pixi/core';
//export * from '@pixi/app';
//export * from '@pixi/sprite';
//export * from '@pixi/assets';
//export * from '@pixi/utils';
//export * from '@pixi/events';

// Renderer plugins
//import * as Renderer from '@pixi/core';
//export { Renderer };

//Attempt to put PIXI code externally from JSX
import * as PIXI from 'pixi.js';

//Bools that are tied to input
let leftInputPressed = false;
let rightInputPressed = false;
let topInputPressed = false;
let bottomInputPressed = false;

//Track the mouse position
const mousePosition = {x: 0, y: 0}



//The score for the current game session
let currentScore;

//Render/Game loop
const loop = (app, sprite) => {
    app.ticker.add(() => {
        //Update Player
        playerInput(sprite);

        //Check for Collisions
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

    player.rotation = Math.atan2((mousePosition.y - sprite.y), (mousePosition.x - sprite.x));
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

//Returns True or False depending on whether the boxes touch
/*AABB Method Code Adapted from Prof. Dower Chin's tutorial on PIXI.js Collision
Link: https://www.youtube.com/watch?v=-q_Zk5uxk7Q*/
const AABBCollision = (a, b) => {
    //Get required properties of objects
    let objA = a.getBounds();
    let objB = b.getBounds();

    //Make the 4 checks necessary to determine a collision
    return objA.x + objA.width > objB.x 
        && objA.x < objB.x + objB.width
        && objA.y + objA.height > objB.y
        && objA.y < objB.y + objB.height;
};

const setupPlayer = async (app) => {
    //Player Sprite
    const texture = await PIXI.Assets.load('/assets/img/topDownSprite.png');
    const playerSprite = new PIXI.Sprite(texture);

    //Background Properties
    playerSprite.scale = {x:0.3, y:0.3};

    playerSprite.x = app.renderer.width/2;
    playerSprite.y = app.renderer.height/2;

    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;

    app.stage.addChild(playerSprite);

    return playerSprite;
};

const setupBackground = () => {

};

const setupCollectibles = () => {

};

const setupEnemies = () => {

};

//#endregion


//Create the app and begin the render loop
const initApp = async () => {
    const app = new PIXI.Application();
    document.getElementById('gameArea').appendChild(app.view);

    //Background is its own sprite
    const bgTex = await PIXI.Assets.load('/assets/img/darkBackground.jpg');
    const bg = new PIXI.Sprite(bgTex);

    //Edit background properties
    bg.scale = {x: 2, y: 2};
    bg.interactive = true;
    bg.on("mousemove", getMousePosition);
    app.stage.addChild(bg);

    const texture = await PIXI.Assets.load('/assets/img/topDownSprite.png');
    const playerSprite = new PIXI.Sprite(texture);

    //Background Properties
    playerSprite.scale = {x:0.3, y:0.3};

    playerSprite.x = app.renderer.width/2;
    playerSprite.y = app.renderer.height/2;

    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;

    app.stage.addChild(playerSprite);

    //Pickups
    setupCollectibles();

    //Enemies
    setupEnemies();

    //Complete setup and start loop
    setupInputEvents();

    loop(app, playerSprite);
};

export { initApp }