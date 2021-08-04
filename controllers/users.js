const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error('Неверные данные');
      error.statusCode = 400;
      throw error;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неверный формат id' });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .orFail(() => {
      const error = new Error('Неверные данные');
      error.statusCode = 400;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._id, { name, about })
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неверный формат id' });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params._id, { avatar })
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неверный формат id' });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};
