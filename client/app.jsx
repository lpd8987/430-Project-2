const PIXI = require("./pixi.js");

const { useState, useEffect } = React;

//REACT COMPONENTS
//Essentially just a container for the PIXI application
const PIXIApp = () => {
    return (
        <div id="gameArea">
            <h1>GAME</h1>
            <h2 id="score"></h2>
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
       

    if(players.length === 0) {
        return (
            <div>
               <h3>No High Scores yet!</h3>
            </div>
        );
    }
   
    const leaderboardData = players.map((player) => {
        return (
            <div key={player.username}>
                <h2>{player.username} - <strong>{player.highScore}</strong></h2>
            </div>
        );
    });
   

    return (
        <div id="leaderboard" value={leaderboardData} onChange={(e) => setLeaderboard(e.target.value)}>
            {leaderboardData}
        </div>
    );
};

//Render the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const toggleLeaderboardBtn = document.getElementById('leaderboardBtn');

    toggleLeaderboardBtn.addEventListener('click', (e) => {
        e.preventDefault();

    });

    ReactDOM.render(
        <PIXIApp csrf={data.csrfToken} />,
        document.getElementById('content')
        );

    ReactDOM.render(
        <Leaderboard csrf={data.csrfToken} players={[]} />,
        document.getElementById('content2')
        );

    PIXI.initApp(data);
};

window.onload = init;