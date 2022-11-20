const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

// Render the domo maker page
const makerPage = (req, res) => res.render('app');

// Create a new Domo object in the database if it does not already exist
const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.description) {
    return res.status(400).json({ error: 'All parameters are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    description: req.body.description,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json(
      {
        name: newDomo.name,
        age: newDomo.age,
        description: newDomo.description,
      },
    );
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred! ' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
