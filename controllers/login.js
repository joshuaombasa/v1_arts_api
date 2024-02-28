const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Artist = require('../models/artist')
require('dotenv').config()

loginRouter.post('/', async(request,response,next) => {
    const {username, password} = request.body
    try {
        const artist = await Artist.find({username})
        const passwordCorrect = await bcrypt.compare(passwordHash,password)

        if (!(artist && passwordCorrect)) {
            return response.status(400).json({error: 'invalid username or password'})
        }

        const authorForToken = {
            username: artist.username,
            id:artist._id
        }

        const token = jwt.sign(authorForToken,process.env.SECRET,{expiresIn: 60*60})
        response.status(200).json({token, username: author.username, name: author.name})
    } catch (error) {
        next(error)
    }
})

module.exports = loginRouter