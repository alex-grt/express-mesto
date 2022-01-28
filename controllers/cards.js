const Card = require('../models/card');

function getCards(req, res, next) {
  return Card
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(next);
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  return Card
    .findById(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.remove();
        res.status(200).send(card);
        return;
      }

      next(new Error('Forbidden'));
    })
    .catch(next);
}

function setLike(req, res, next) {
  const { cardId } = req.params;
  const owner = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch(next);
}

function removeLike(req, res, next) {
  const { cardId } = req.params;
  const owner = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: owner } },
      { new: true },
    ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
