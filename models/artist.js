const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
    username:{type:String, minLength:5 ,required: true},
    name:{type:String, minLength:5 ,required: true},
    passwordHash:{type:String, minLength:5 ,required: true},
    arts:[{type:mongoose.Schema.Types.ObjectId,ref: 'Arts'}]
})

artistSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Artist', artistSchema)