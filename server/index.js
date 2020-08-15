const express = require('express')
const path = require('path')
const apiMocker = require('mocker-api')
const { request } = require('http')
const { response } = require('express')

const app = express()

app.get('/', (request, response) => {
  response.status(200)
  response.send('hello express')
  response.end()
})
app.get('/rest', (request, response) => {
  response.status(200)
  response.send('hello express')
  response.end()
})

apiMocker(app, path.resolve('./mocker/mocker.js'))
app.listen(5000)
