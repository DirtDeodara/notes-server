const client = require('../utils/client');

module.exports = {
  find() {
    return client.query(`
      SELECT 
        id, 
        author, 
        title,
        created, 
        is_published as "isPublished"
      FROM notes;
    `)
      .then(result => result.rows);

  }
};
