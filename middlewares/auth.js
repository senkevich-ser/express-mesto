const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnAutorizedErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
   throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new ForbiddenErr("Отсутствует право доступа");
  }

  req.user = payload;

  next();
};
