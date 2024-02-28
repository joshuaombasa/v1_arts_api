const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const artistsRouter = require('./controllers/artists')
const artsRouter = require('./controllers/arts')
const loginRouter = require('./controllers/login')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URL)
   .then(() => logger.info('connected to MongoDB'))
   .catch(error => logger.error(error.message))

app.use(express.json())
app.use(cors())

app.use(middleware.requestLogger)

app.use('/api/arts', artsRouter)
app.use('/api/artists', artistsRouter)
app.use('/api/', loginRouter)

app.use(middleware.uknownEndpointHandler)
app.use(middleware.errorHandler)

module.exports = app

