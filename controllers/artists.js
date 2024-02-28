const artistsRouter = require('express').Router()
const Artist = require('../models/artist')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


artistsRouter.get('/', async(request,response,next) => {
    try {
        const artists = await Artist.find({})
        response.json(artists).populate('arts')
    } catch (error) {
        next(error)
    }
})

artistsRouter.get('/:id', async(request,response,next) => {
    try {
        const artist = await Artist.findById(request.params.id)
        if (!artist) {
            return response.status(404).end()
        }
        response.json(artist).populate('arts')
    } catch (error) {
        next(error)
    }
})

artistsRouter.post('/', async(request,response,next) => {
    const {username, name, password} = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const artist = new Artist({
        username,
        name,
        passwordHash
    })
    try {
        const savedArtist = await artist.save()
        response.status(201).json(savedArtist)
    } catch (error) {
        next(error)
    }
})

artistsRouter.put('/:id', async(request,response,next) => {
    const {username, name, password} = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const artist = {
        username,
        name,
        passwordHash
    }

    try {
        const updatedArtist = await Artist.findByIdAndUpdate(
            request.params.id,
            artist,
            {new: true}
        )
    } catch (error) {
        next(error)
    }
})

artistsRouter.delete('/:id', async(request,response,next) => {
    try {
        await Artist.findByIdAndDelete(request.params.id)
    } catch (error) {
        
    }
})

module.exports = artistsRouter