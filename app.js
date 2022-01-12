const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '61db4c0811dd9e4af5a87a25',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Слушаем порт ${PORT}`);
});
