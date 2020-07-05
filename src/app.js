require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const usersRouter = require('../users/users-router')
const authRouter = require('../auth/auth-router')
const savedMealsRouter = require('../saved-meals/saved-meals-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.get('/', (req, res) => {
     res.send('Hello, Boilerplate!')
     })
app.use('/api/users', usersRouter)
app.use('/api/auth/login', authRouter)
app.use('/api/saved-meals', savedMealsRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app