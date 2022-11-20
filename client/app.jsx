const helper = require("./helper.js");
//import { Assets } from "pixi.js";
import * as PIXI from "./pixi.js"; 

//Bools that are tied to input
let leftInputPressed = false;
let rightInputPressed = false;
let topInputPressed = false;
let bottomInputPressed = false;


//REACT COMPONENT
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
        </div>
    );
};

//Render loop
const loop = (app, sprite) => {
    app.ticker.add(() => {
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

//Create the app and begin the render loop
const initApp = async () => {
    const app = new PIXI.Application();
    document.getElementById('gameArea').appendChild(app.view);

    const texture = await PIXI.Assets.load('/assets/img/marioSprite.png');
    const dummySprite = new PIXI.Sprite(texture);

    dummySprite.scale = {x:0.3, y:0.3};

    dummySprite.x = app.renderer.width/2;
    dummySprite.y = app.renderer.height/2;

    dummySprite.anchor.x = 0.5;
    dummySprite.anchor.y = 0.5;

    app.stage.addChild(dummySprite);

    setupInputEvents();

    loop(app, dummySprite);
};

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('content')
        );

    initApp();
};

window.onload = init;