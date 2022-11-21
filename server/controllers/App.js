// Renders the app page
const appPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};

/* Load Level Data from Server:
POST /saveScore - save the player's score when they die in the game
POST /addToLeaderboard - if the player's score is among the top 10 in the leaderboard,
// save the player's username and score to the leaderboard.
*/

module.exports.appPage = appPage;
