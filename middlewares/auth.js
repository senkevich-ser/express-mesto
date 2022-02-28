const jwt = require('jsonwebtoken');
const UnAutorized = require('../errors/UnAutorizedErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAutorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnAutorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
