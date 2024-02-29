const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('___')

    next()
}

const uknownEndpointHandler = (request, response, next) => {
    response.status(400).json({ error: 'unknown endpoint' })
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        response.status(400).json({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next()
}

module.exports = {
    requestLogger,
    uknownEndpointHandler,
    errorHandler
}