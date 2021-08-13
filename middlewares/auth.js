const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env; // секрутный ключ

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) { // проверка на наличие cookies для попадания в
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
