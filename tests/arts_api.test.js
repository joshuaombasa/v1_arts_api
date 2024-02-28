const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Art = require('../models/art')
const Artist = require('../models/artist')
const api = supertest(app)
const helper = require('./test_helper')


beforeEach(async () => {
    await Art.deleteMany({})
   
    const artObjects = helper.somearts.map(art => new Art(art))
    const promiseArray = artObjects.map(art => art.save())
    await Promise.all(promiseArray)
})

beforeEach(async () => {
    await Artist.deleteMany({})
    const artistObjects = helper.someartists.map(artist => new Artist(artist))
    // const promiseArray = artistObjects.map(artist =>  artist.save())
    // await Promise.all(promiseArray)
})


describe('when there is initially some saved arts', () => {
    test('arts are returned as json', async () => {
        await api.get('/api/arts')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })


    test('all arts are returned', async () => {
        const response = await api.get('/api/arts')

        expect(response.body).toHaveLength(helper.somearts.length)
    })

    test('a specific art is within the returned arts', async () => {
        const response = await api.get('/api/arts')

        const names = response.body.map(r => r.name)
        expect(names).toContain('Covfefe')
    })
})

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const artsAtStart = await helper.artsInDb()
        artToView = artsAtStart[0]
        const response = await api.get(`/api/arts/${artToView.id}`)
            .expect(200)
            .expect('Content-TYpe', /application\/json/)

        expect(response.body).toEqual(artToView)
    })

    test('fails with status code 404 if id does not exist', async () => {
        const nonExistentid = await helper.nonExistentId()
        await api.get(`/api/arts/${nonExistentid}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '2222222222131'
        await api.get(`/api/arts/${invalidId}`)
            .expect(400)
    })
})


describe('addition of a new art', () => {
    test('succeeds  if data is valid', async () => {
        const art = {
            name: 'MAGA S-HOE',
            category: 'modern-politico',
            price: '5000'
        }

        await api.post('/api/arts')
            .send(art)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/arts')
        expect(response.body).toHaveLength(helper.somearts.length + 1)
        const names = response.body.map(r => r.name)
        expect(names).toContain('MAGA S-HOE')
    })


    test('fails with status code 400 if data is invalid', async () => {
        const art = {
            category: 'modern-politico',
            price: '5000'
        }

        await api.post('/api/arts')
            .send(art)
            .expect(400)

        const response = await api.get('/api/arts')
        expect(response.body).toHaveLength(helper.somearts.length)
    })
})


describe('deletion of an art', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const artsAtStart = await helper.artsInDb()
        const artToDelete = artsAtStart[0]

        await api.delete(`/api/arts/${artToDelete.id}`)
            .expect(204)

        const artsAtEnd = await helper.artsInDb()
        expect(artsAtEnd).toHaveLength(artsAtStart.length - 1)

        const names = artsAtEnd.map(a => a.name)

        expect(names).not.toContain(artToDelete.name)
    })
})

describe('when there are initially some saved artists', () => {
    test('artists are returned as json', async() => {
        await api.get('/api/artists')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    })

    // test('all artists are returned', async() => {
    //     const result = await api.get('/api/artists')
    //     const names = result.map(r => r.name)
    //     expect(names).toContain('Bannon')
    // })
})

afterAll(async () => {
    await mongoose.connection.close()
})