const mongoose = require('mongoose')

const artSchema = new mongoose.Schema({
    name: { type: String, minLength: 5, required: true },
    category: { type: String, minLength: 5, required: true },
    price: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artists' }
})

artSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Art', artSchema)