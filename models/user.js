const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (email) => validator.isEmail(email) },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Себастьян Перейра',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Торговец чёрным деревом',
  },
  avatar: {
    type: String,
    default: 'https://i7.imageban.ru/out/2022/01/23/9d7970840a64cb4cb91fc28e9f65cf39.jpg',
    validate: {
      validator: function regexp(link) {
        const regex = /^(https?:\/\/)(www.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
        return regex.test(link);
      },
    },
  },
}, {
  versionKey: '',
});

module.exports = mongoose.model('user', userSchema);
