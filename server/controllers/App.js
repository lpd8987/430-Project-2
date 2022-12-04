const models = require('../models');

const { Account } = models;

// Renders the app page
const appPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};


//POST /addToLeaderboard - if the player's score is among the top 10 in the leaderboard,
//save the player's username and score to the leaderboard.

//GET /getCurrentPlayerData - Returns a JSON object with relevant player information
const getCurrentPlayerData = async (req, res) => {
  try {
    const playerUsername = req.session.account;

    const playerAccount = await Account.findOne({ playerUsername }).exec();

    //Theoretically should not occur if the user is logged in
    if(!playerAccount) {
      throw new Error();
    }

    //Return relevant player data (username, score)
    return res.status(200).json({
      username: playerAccount.username,
      highScore: playerAccount.highScore
    })

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

//GET /getPlayerData - Returns a JSON object with relevant player information
/*Used for getting data of players in the database that are not necessarily 
the curent players*/
const getPlayerData = async (req, res) => {
  try {
    const playerUsername = req.body.username;

    const playerAccount = await Account.findOne({ playerUsername }).exec();

    //Theoretically should not occur if the user is logged in
    if(!playerAccount) {
      throw new Error();
    }

    //Return relevant player data (username, score)
    return res.status(200).json({
      username: playerAccount.username,
      highScore: playerAccount.highScore
    })

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

//POST /saveScore - save the player's score when they die in the game
const saveScore = async (req, res) => {
  try {
    const playerUsername = req.session.account;

    const playerAccount = await Account.findOne({ playerUsername }).exec();

    //Theoretically should not occur if the user is logged in
    if(!playerAccount) {
      throw new Error();
    }

    //Only update account information if the user achieves a higher score than they already have
    if(req.body.score > playerAccount.highScore) {
      playerAccount.highScore = req.body.score;
      await playerAccount.save();
      return res.status(201).json({ message: 'High Score updated!' });
    } else {
      return res.status(200).json(
        { 
          message: 'Request Successful- but score was less than high score'
        });
    }

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

module.exports = {
  appPage,
  saveScore,
  getCurrentPlayerData,
  getPlayerData
}
