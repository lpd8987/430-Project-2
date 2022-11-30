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
let mousePosition = {x: 0, y: 0}

//Render loop
const loop = (app, sprite) => {
    app.ticker.add(() => {

        //Move the player around the screen
        if(leftInputPressed){
            sprite.x -= 5;
        }
        if(rightInputPressed){
            sprite.x += 5;
        }
        if(topInputPressed){
            sprite.y -= 5;
        }
        if(bottomInputPressed){
            sprite.y += 5;
        }

        //AABB check with collectibles

        //document.getElementById('mousePosition').innerText = `${mousePosition.x}, ${mousePosition.y}`;
        //document.getElementById('mousePosition').innerText = `${sprite.x}, ${sprite.y}`;

        sprite.rotation = Math.atan2((mousePosition.y - sprite.y), (mousePosition.x - sprite.x));
    });
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

const getMousePosition = (e) => {
    mousePosition.x = e.data.global.x;
    mousePosition.y = e.data.global.y;
};

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

    //Player Sprite
    const texture = await PIXI.Assets.load('/assets/img/topDownSprite.png');
    const dummySprite = new PIXI.Sprite(texture);

    //Background Properties
    dummySprite.scale = {x:0.3, y:0.3};

    dummySprite.x = app.renderer.width/2;
    dummySprite.y = app.renderer.height/2;

    dummySprite.anchor.x = 0.5;
    dummySprite.anchor.y = 0.5;

    app.stage.addChild(dummySprite);

    //Complete setup and start loop
    setupInputEvents();

    loop(app, dummySprite);
};

export { initApp }