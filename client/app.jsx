const PIXI = require("./pixi.js");

let leaderboardActive = false;

//#region REACT COMPONENTS

//Essentially just a container for the PIXI application
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h2 id="score">Score:</h2>
            <p id="highScore">High Score: </p>
        </div>
    );
};

//Live Leaderboard that updates whenever a score changes
const Leaderboard = (props) => {
    //If the database is empty for some reason
    if(props.players.length === 0) {
        return (
            <div>
               <h3>No High Scores yet!</h3>
            </div>
        );
    }
   
    //If the database has data in it
    const leaderboardData = props.players.map((player) => {
        return (
            <li key={player.username}>
                <strong>{player.username}</strong> - {player.highScore}
            </li>
        );
    });
   

    return (
        <div id="leaderboard">
            <h2><u>Leaderboard</u></h2>
            <ol>
                {leaderboardData}
            </ol>
        </div>
    );
};

//Content instructing the player how to play the game
const HowToPlay = () => {
    return (
        <div id="howToPlay">
            <h2><u>How To Play:</u></h2>
            <ul>
                <li>Use WASD keys to move.</li>
                <li>Avoid monsters and gather as many collectibles as you can!</li>
            </ul>
        </div>
    );
};
//#endregion

//#region Helpers
//Re-Renders the Leaderboard React component
const refreshLeaderboardData = async (data) => {
    leaderboardActive = true;

    const response = await fetch('/getLeaderboardData');
    const players = await response.json();

    ReactDOM.render(
        <Leaderboard csrf={data} players={players} />,
        document.getElementById('secondaryContent')
        );
};
//#endregion

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const showLeaderboardBtn = document.getElementById('leaderboardBtn');
    const howToPlayBtn = document.getElementById('howToPlayBtn');


    //EVENT LISTENERS
    //Re-renders the leaderboard component if it is active on a gameOver event
    /*This is to prevent the page from changing unexpectedly if the
    user has the how to play menu open.*/
    document.addEventListener('gameOver', async () => {
        if(leaderboardActive){
            await refreshLeaderboardData(data.csrfToken);
        }
    });

    showLeaderboardBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await refreshLeaderboardData();
    });

    howToPlayBtn.addEventListener('click', (e) => {
        leaderboardActive = false;
        e.preventDefault();
        ReactDOM.render(
            <HowToPlay csrf={data.csrfToken} />,
            document.getElementById('secondaryContent')
            );
    });

    //INITIAL REACT DOM COMPONENTS
    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('mainContent')
        );

    ReactDOM.render(
        <HowToPlay csrf={data.csrfToken} />,
        document.getElementById('secondaryContent')
        );

    //STARTUP PIXI APPLICATION
    PIXI.initApp(data);
};

window.onload = init;