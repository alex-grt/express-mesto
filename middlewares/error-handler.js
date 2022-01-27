const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = require('../utils/errors');

module.exports = (err, req, res, next) => {
  if (err.message === 'Forbidden') {
    res.status(FORBIDDEN).send({ message: 'Доступ запрещён' });
  } else if (err.message === 'Unauthorized') {
    res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  } else if (err.code === 11000) {
    res.status(CONFLICT).send({ message: 'Пользователь с таким email существует' });
  } else if (err.message === 'NotFound') {
    res.status(NOT_FOUND).send({ message: 'Ресурс не найден' });
  } else {
    res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }

  next();
};
