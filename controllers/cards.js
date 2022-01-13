const Card = require('../models/card');

function getCards(req, res) {
  return Card
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;

  return Card
    .findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function setLike(req, res) {
  const { cardId } = req.params;
  const owner = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function removeLike(req, res) {
  const { cardId } = req.params;
  const owner = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
