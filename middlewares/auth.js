const jwt = require('jsonwebtoken');
const { UNAUTHORIZED, FORBIDDEN } = require('../utils/errors');

const { JWT_SECRET = 'oops' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(FORBIDDEN).send({ message: 'Доступ запрещён' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
