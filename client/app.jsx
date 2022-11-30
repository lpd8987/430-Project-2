const helper = require("./helper.js");
const PIXI = require("./pixi.js");

//REACT COMPONENT
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
            <p id="mousePosition"></p>
        </div>
    );
};

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('content')
        );

    PIXI.initApp();
};

window.onload = init;