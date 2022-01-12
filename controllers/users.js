const User = require('../models/user');

function getUsers(req, res) {
  return User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

function getUser(req, res) {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  const owner = req.user._id;

  return User
    .findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    ).then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  const owner = req.user._id;

  return User
    .findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    ).then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
