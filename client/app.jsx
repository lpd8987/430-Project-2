const PIXI = require("./pixi.js");

//REACT COMPONENT
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
            <h2 id="score"></h2>
            <p id="highScore">High Score: </p>
        </div>
    );
};

/*const Leaderboard = () => {

};*/

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('content')
        );

    PIXI.initApp(data);
};

window.onload = init;