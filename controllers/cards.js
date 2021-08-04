const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('Неверные данные');
      error.statusCode = 400;
      throw error;
    })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = res.body;

  Card.create({ name, link, owner: req.user._id })
    .orFail(() => {
      const error = new Error('Неверные данные');
      error.statusCode = 400;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(() => {
      const error = new Error('Карточка по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
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
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .orFail(() => {
      const error = new Error('Неверные данные');
      error.statusCode = 400;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};
