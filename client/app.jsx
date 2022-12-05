const PIXI = require("./pixi.js");

const { useState, useEffect } = React;

//REACT COMPONENTS
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
    const [players, setLeaderboard] = useState(props.players);

    useEffect(async () => {
        const response = await fetch('/getLeaderboardData');
        const players = await response.json();

        setLeaderboard(players);
    }, [players]);
       
    //If the database is empty for some reason
    if(players.length === 0) {
        return (
            <div>
               <h3>No High Scores yet!</h3>
            </div>
        );
    }
   
    //If the database has data in it
    const leaderboardData = players.map((player) => {
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

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const showLeaderboardBtn = document.getElementById('leaderboardBtn');
    const howToPlayBtn = document.getElementById('howToPlayBtn');

    showLeaderboardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <Leaderboard csrf={data.csrfToken} players={[]} />,
            document.getElementById('secondaryContent')
            );
    });

    howToPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <HowToPlay csrf={data.csrfToken} />,
            document.getElementById('secondaryContent')
            );
    });

    //Render the Game and How to Play components by default
    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('mainContent')
        );

    ReactDOM.render(
        <HowToPlay csrf={data.csrfToken} />,
        document.getElementById('secondaryContent')
        );
    

    PIXI.initApp(data);
};

window.onload = init;