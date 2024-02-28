const artsRouter = require('express').Router()
const Artist = require('../models/artist')
const Art = require('../models/art')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getRequestToken = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

artsRouter.get('/', async (request, response, next) => {
    try {
        const arts = await Art.find({}).populate('artist')
        response.json(arts)
    } catch (error) {
        next(error)
    }
})

artsRouter.get('/:id', async (request, response, next) => {
    try {
        const art = await Art.findById(request.params.id).populate('artist')
        if (!art) {
            return response.status(404).end()
        }
        response.json(art)
    } catch (error) {
        next(error)
    }
})

artsRouter.post('/', async (request, response, next) => {
    const { name, category, price } = request.body

    try {
        const decoded = jwt.decode(getRequestToken(request), process.env.SECRET)

        if (!decoded.id) {
            return response.status(401).json({ error: 'invalid or missing token' })
        }

        const artist = await Artist.findOne(decoded.id)
        const art = new Art({
            name,
            category,
            price,
            artist: decoded.id
        })
        const savedArt = await art.save()
        artist.arts = artist.arts.concat(savedArt.id)
        await artist.save()
        response.status(201).json(savedArt)
    } catch (error) {
        next(error)
    }
})

artsRouter.put('/:id', async (request, response, next) => {
    const { name, category, price } = request.body
    const decoded = jwt.decode(getRequestToken(request), process.env.SECRET)
    if (!decoded.id) {
        return response.status(401).json({ error: 'invalid or missing token' })
    }

    const artist = await Artist.findOne(decoded.id)
    const art = {
        name,
        category,
        price,
        artist: decoded.id
    }
    try {
        const newArt = await Art.findByIdAndUpdate(
            request.params.id,
            art,
            { new: true }
        )
        response.json(newArt)
    } catch (error) {
        next(error)
    }
})

artsRouter.delete('/:id', async (request, response, next) => {
    const decoded = jwt.decode(getRequestToken(request))
    if (!decoded.id) {
        return response.status(401).json({ error: 'invalid or missing token' })
    }
    try {
        await Art.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})


module.exports = artsRouter
