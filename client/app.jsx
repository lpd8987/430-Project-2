const helper = require("./helper.js");
import * as PIXI from "./pixi.js";

//Bools that are tied to input
let leftInputPressed = false;
let rightInputPressed = false;
let topInputPressed = false;
let bottomInputPressed = false;

let mousePosition = {x: 0, y: 0}

//REACT COMPONENT
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
            <p id="mousePosition"></p>
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

        document.getElementById('mousePosition').innerText = `${mousePosition.x}, ${mousePosition.y}`;
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

const mouseClick = (e) => {
    //console.log('Mouse clicked');
    mousePosition.x = e.data.global.x;
    mousePosition.y = e.data.global.y;
};

//Create the app and begin the render loop
const initApp = async () => {
    const app = new PIXI.Application();
    document.getElementById('gameArea').appendChild(app.view);

    const bgTex = await PIXI.Assets.load('/assets/img/darkBackground.jpg');
    const bg = new PIXI.Sprite(bgTex);
    bg.scale = {x: 2, y: 2};
    bg.interactive = true;
    bg.on("mousemove", mouseClick);
    app.stage.addChild(bg);

    const texture = await PIXI.Assets.load('/assets/img/topDownSprite.png');
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