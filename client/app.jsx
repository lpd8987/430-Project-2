const helper = require("./helper.js");
import { Application, Assets, Sprite } from "pixi.js";

let app;

const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
        </div>
    );
};

const initApp = async () => {
    app = new Application();
    document.getElementById('gameArea').appendChild(app.view);

    const texture = await Assets.load('/assets/img/marioSprite.png');
    const dummySprite = new Sprite(texture);

    dummySprite.x = app.renderer.width/2;
    dummySprite.y = app.renderer.height/2;

    dummySprite.anchor.x = 0.5;
    dummySprite.anchor.y = 0.5;

    app.stage.addChild(dummySprite);

    app.ticker.add(() => {
        dummySprite.rotation += 0.01;
    });
};

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