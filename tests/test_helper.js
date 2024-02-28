const Art = require('../models/art')
const Artist = require('../models/artist')

const somearts = [
    {
        name: 'Bamboo stick',
        category: 'ancient',
        price: '5000'
    },
    {
        name: 'Covfefe',
        category: 'modern-politico',
        price: '5000'
    },
]

const someartists = [
    {
        username: 'donaldTrump@maga',
        name: 'Trump',
        password: '23f23ferferfe'
    },
    {
        username: 'joebannon@maga',
        name: 'Bannon',
        password: 'egtrgtrggr'
    },
]

const nonExistentId = async () => {
    const art = new Art({
        name: 'some name',
        category: 'some category',
        price: '5000'
    })

    const savedArt = await art.save()
    await Art.findByIdAndDelete(savedArt._id)
    return savedArt._id.toString()
}

const artsInDb = async () => {
    const arts = await Art.find({})
    const artsToReturn = arts.map(art => art.toJSON())
    return artsToReturn
}

const artistsInDB = async() => {
    const artists = await Artist.find({})
    const artistsToReturn = artists.map(artist => artist.toJSON())
    return artistsToReturn
}

module.exports = {
    nonExistentId,
    somearts,
    someartists,
    artsInDb,
    artistsInDB
}