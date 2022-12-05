const models = require('../models');

const { Account } = models;

// Renders the app page
const appPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};

// Sort DB by score
const getLeaderboardData = async (req, res) => {
  // Gets data in descending order (highest score first)
  const sortedData = await Account.find({ }).sort({ highScore: -1 });

  // Return the sorted data for display
  return res.status(200).json(sortedData);
};

// GET /getCurrentPlayerData - Returns a JSON object with relevant player information
const getCurrentPlayerData = async (req, res) => {
  try {
    const playerUsername = req.session.account.username;
    console.log(req.session.account);

    const playerAccount = await Account.findOne({ username: playerUsername }).exec();
    console.log(playerAccount);

    // Theoretically should not occur if the user is logged in
    if (!playerAccount) {
      throw new Error();
    }

    // Return relevant player data (username, score)
    return res.status(200).json({
      username: playerAccount.username,
      highScore: playerAccount.highScore,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

// GET /getPlayerData - Returns a JSON object with relevant player information
/* Used for getting data of players in the database that are not necessarily
the curent players */
const getPlayerData = async (req, res) => {
  try {
    const playerUsername = req.body.username;

    const playerAccount = await Account.findOne({ username: playerUsername }).exec();

    // Theoretically should not occur if the user is logged in
    if (!playerAccount) {
      throw new Error();
    }

    // Return relevant player data (username, score)
    return res.status(200).json({
      username: playerAccount.username,
      highScore: playerAccount.highScore,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

// POST /saveScore - save the player's score when they die in the game
const saveScore = async (req, res) => {
  try {
    const playerUsername = req.session.account.username;

    const playerAccount = await Account.findOne({ username: playerUsername }).exec();

    // Theoretically should not occur if the user is logged in
    if (!playerAccount) {
      throw new Error();
    }

    // Only update account information if the user achieves a higher score than they already have
    if (req.body.score > playerAccount.highScore) {
      playerAccount.highScore = req.body.score;
      await playerAccount.save();
      return res.status(201).json({ message: 'High Score updated!' });
    }
    return res.status(200).json(
      {
        message: 'Request Successful- but score was less than high score',
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

module.exports = {
  appPage,
  saveScore,
  getCurrentPlayerData,
  getPlayerData,
  getLeaderboardData,
};
