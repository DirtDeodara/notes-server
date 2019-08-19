const { Router } = require('express');
const Note = require('../models/Note');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { title, body } = req.body;

    Note.create({
      title,
      body
    })
      .then(createdNote => {
        res.send(createdNote);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Note
      .find()
      .then(notes => {
        res.send(notes);
      })
      .catch(next);
  });
