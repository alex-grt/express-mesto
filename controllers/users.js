const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function getUsers(req, res, next) {
  return User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function getUser(req, res, next) {
  const { userId } = req.params;

  return User
    .findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch(next);
}

function getOwner(req, res, next) {
  const owner = req.user._id;

  return User
    .findById(owner)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch(next);
}

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send(user))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Unauthorized'));
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Unauthorized'));
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'trulyalya', { expiresIn: '7d' });

      res.status(202).send({ token });
    })
    .catch(next);
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;
  const owner = req.user._id;

  return User
    .findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const owner = req.user._id;

  return User
    .findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  getOwner,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
