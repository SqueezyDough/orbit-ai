var express = require('express')
const mongo = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var multer = require('multer')

require('dotenv').config();

const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`

mongo.connect(url,{ useNewUrlParser: true }, function (err, client) {
    if (err) {
    throw err
    }

    db = client.db(process.env.DB_NAME)

    const collection = db.collection('users')

    //collection.insertMany([{name: 'Togo'}, {name: 'Syd'}], (err, result) => {

    //})

    collection.find().toArray((err, items) => {
        console.log(items)
      })

      client.close()
})