require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Note = require('../lib/models/Note');

describe('note route tests', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a new note', () => {
    return request(app)
      .post('/api/v1/notes')
      .send({
        title: 'New Note!',
        body: 'I am a pretty new note'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          title: 'New Note!',
          body: 'I am a pretty new note'
        });
      });
  });

  it('can GET all notes', async() => {
    const notes = await Note.create([
      { title: 'a note', body: 'a note body' },
      { title: 'another note', body: 'a note body' },
      { title: 'anotherother note', body: 'a note body' }
    ]);
    return request(app)
      .get('/api/v1/notes')
      .then(res => {
        const notesJSON = JSON.parse(JSON.stringify(notes));
        notesJSON.forEach(note => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            __v: 0,
            title: note.title,
            body: note.body
          });
        });
      });
  });
});
