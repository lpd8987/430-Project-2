const PIXI = require("./pixi.js");

let leaderboardActive = false;

//#region REACT COMPONENTS

//Essentially just a container for the PIXI application
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <div id="playerData">
                <p className="has-text-weight-bold is-size-3" id="playerName">Username</p>
                <p className="has-text-weight-bold is-size-3" id="score">Score:</p>
                <p className="has-text-weight-bold is-size-3" id="highScore">High Score: </p>
            </div>
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
            <li className="m-5 is-size-4" key={player.username}>
                <strong>{player.username}</strong> - {player.highScore}
            </li>
        );
    });

    return (
        <div id="leaderboard">
            <h2 className="title is-underlined">Leaderboard</h2>
            <ol className="content">
                {leaderboardData}
            </ol>
        </div>
    );
};

const GameSettings = (props) => {
    return (
        <form>
            <h2 className="title is-underlined">Sound Options:</h2>
            <label className="label" htmlFor="musicSlider">Music Volume</label>
            <input name="musicSlider" type="range" min="0" max="100" defaultValue={props.music.volume * 100} id="musicVolumeSlider"></input>

            <label className="label" htmlFor="sfxSlider">SFX Volume</label>
            <input name="sfxSlider" type="range" min="0" max="100" defaultValue={props.sfx[0].volume * 100} id="sfxVolumeSlider"></input>
        </form>
    );
}

//Content instructing the player how to play the game
const HowToPlay = () => {
    return (
        <div id="howToPlay">
            <h2 className="title is-underlined">How To Play:</h2>
            <ul className="content">
                <li>Use WASD keys to move.</li>
                <li>Avoid monsters and gather as many collectibles as you can!</li>
                <li>Press the enter key to restart the game if you lose.</li>
                <li>Hint: Moving out of bounds will move you to the other side.</li>
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
    const gameSettingsBtn = document.getElementById('gameSettingsBtn');


    //EVENT LISTENERS
    //Re-renders the leaderboard component if it is active on a gameOver event
    /*This is to prevent the page from changing unexpectedly if the
    user has the how to play menu open.*/
    document.addEventListener('gameOver', async () => {
        if(leaderboardActive){
            await refreshLeaderboardData(data.csrfToken);
        }
    });

    //SHOW/UPDATE LEADERBOARD BTN
    showLeaderboardBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        showLeaderboardBtn.classList.add('is-success');
        howToPlayBtn.classList.remove('is-success');
        gameSettingsBtn.classList.remove('is-success');

        await refreshLeaderboardData();
    });

    //INSTRUCTIONAL COMPONENT
    howToPlayBtn.addEventListener('click', (e) => {
        leaderboardActive = false;
        e.preventDefault();

        showLeaderboardBtn.classList.remove('is-success');
        howToPlayBtn.classList.add('is-success');
        gameSettingsBtn.classList.remove('is-success');

        ReactDOM.render(
            <HowToPlay csrf={data.csrfToken} />,
            document.getElementById('secondaryContent')
            );
    });

    //GAME SETTINGS COMPONENT
    gameSettingsBtn.addEventListener('click', (e) => {
        leaderboardActive = false;
        e.preventDefault();

        showLeaderboardBtn.classList.remove('is-success');
        howToPlayBtn.classList.remove('is-success');
        gameSettingsBtn.classList.add('is-success');

        ReactDOM.render(
            <GameSettings csrf={data.csrfToken} music={PIXI.music} sfx={[PIXI.defaultPickup, PIXI.highScoreNotification]}/>,
            document.getElementById('secondaryContent')
            );

        document.getElementById('musicVolumeSlider').addEventListener('change', () => {
            PIXI.music.volume = document.getElementById('musicVolumeSlider').value / 100;
        })

        document.getElementById('sfxVolumeSlider').addEventListener('change', () => {
            PIXI.defaultPickup.volume = document.getElementById('sfxVolumeSlider').value / 100;
            PIXI.highScoreNotification.volume = document.getElementById('sfxVolumeSlider').value / 100;
        })
    });

    //INITIAL REACT DOM COMPONENTS
    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('mainContent')
        );

    ReactDOM.render(
        <HowToPlay csrf={data.csrfToken}/>,
        document.getElementById('secondaryContent')
        );

    //STARTUP PIXI APPLICATION
    PIXI.initApp(data);
};

window.onload = init;