require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const client = require('../lib/utils/client');
const child_process = require('child_process');

describe('note route tests', () => {
  beforeEach(() => {
    child_process.execSync('npm run recreate-tables');
  });

  afterAll(() => {
    return client.end();
  });

  const TEST_NOTE = {
    author: 'Nerd',
    title: 'Zippity',
    body: 'whozit whatzit'
  };

  const createNote = (note = TEST_NOTE) => request(app)
    .post('/api/v1/notes')
    .expect(200)
    .send(note);

  const testNote = note => {
    expect(note).toEqual({
      id: expect.any(Number),
      author: 'Nerd',
      title: 'Zippity',
      body: 'whozit whatzit',
      isPublished: false,
      created: expect.any(String)
    });
  };

  it('creates a note', () => {
    return createNote()
      .then(({ body }) => {
        testNote(body);
      });
  });

  it('gets a note by id', () => {
    return createNote()
      .then(({ body }) => {
        return request(app)
          .get(`/api/v1/notes/${body.id}`)
          .expect(200);
      })
      .then(({ body }) => {
        testNote(body);
      });
  });

  it('returns 404 on non-existant id', () => {
    return request(app)
      .get('/api/v1/notes/100')
      .expect(404);
  });

  it('gets a list of notes', () => {
    return Promise.all([
      createNote({ title: 'note uno', author: 'nerd', body: 'body uno' }),
      createNote({ title: 'note dos', author: 'nerd', body: 'body dos' }),
      createNote({ title: 'note tres', author: 'nerd', body: 'body tres' })
    ])
      .then(() => {
        return request(app).get('/api/v1/notes')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(3);
          });
      });
  });

  it('updates a note', () => {
    return createNote()
      .then(({ body }) => {
        body.title = 'New Title';
        return request(app)
          .put(`/api/v1/notes/${body.id}`)
          .send(body)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.title).toBe('New Title');
      });
  });

  it('deletes a note', () => {
    return createNote()
      .then(({ body }) => {
        return request(app)
          .delete(`/api/v1/notes/${body.id}`)
          .expect(200)
          .then(({ body: removed }) => {
            expect(removed).toEqual(body);
            return body.id;
          });
      })
      .then(id => {
        return request(app)
          .get(`/api/v1/notes/${id}`)
          .expect(404);
      });
  });

});
