const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cors')());


app.use('/api/v1/notes', require('./routes/notes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
