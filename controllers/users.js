const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(401).send({ message: 'uncorrect  password' });
          } const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res
            .cookie('jwt', token, {
              httpOnly: true,
              sameSite: true,
              maxAge: 3600000 * 24 * 7,
            })
            .end();
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Поле email или password не должны быть пустыми',
        });
      } else {
        res.status(401).send({ message: 'Неправельный почтовый адресс' });
      }
    });
};

module.exports.createUser = (req, res) => { // signup
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(403).send({ message: 'Подльзователь с такой почтой уже существует' });
      } bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((usr) => res.status(201).send({
          _id: usr._id,
          email: usr.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: err.message });
          } res.status(500).send({ message: err.message });
        });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({ message: 'Error!' });
      }
    });
};
