const client = require('../lib/client');
const types = require('./types');
const cats = require('./cats');

// TODO fix this to work with my real seed data

// "Promise all" does a parallel execution of async tasks
Promise.all(
  types.map(type => {
    return client
      .query(
        `
            INSERT INTO types (name)
            VALUES ($1)
            RETURNING *;
        `,
        [type]
      )
      .then(result => result.rows[0]);
  })
)
  .then(types => {
    // "Promise all" does a parallel execution of async tasks
    return Promise.all(
      cats.map(cat => {
        const type = types.find(type => {
          return type.name === cat.type;
        });
        const typeId = type.id;

        return client.query(
          `
                    INSERT INTO cats (name, type_id, url, year, lives, is_sidekick)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
          [cat.name, typeId, cat.url, cat.year, cat.lives, cat.isSidekick]
        );
      })
    );
  })
  .then(() => console.log('seed data load complete'), err => console.log(err))
  .then(() => {
    client.end();
  });
