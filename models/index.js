const express = require('express')
const mongoose = require('mongoose')
const schema = require('./user.model').UserSchema;

const bodyParser = require('body-parser')
const multer = require('multer')

require('dotenv').config();


const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

mongoose.connect(url,  { useNewUrlParser: true }).then(
  () => {
    //construct model
    let User = mongoose.model('User', schema);

    // create new instance of user
    let newUser = new User({
      email: 'lvanbiljouw4@hotmail.com',
      password: 'myPw',
      fullname: 'Leroy van Biljouw',
      birthdate: new Date('1993-10-19'),
      gender: 'male',
      sexualPreference: 'female'
    })

    console.log(newUser);

    newUser.save(function (err) {
      console.log(err);
    });
  },
  err => { console,log(err) }
);