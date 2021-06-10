const mongoose = require('mongoose')

const Schema = mongoose.Schema

// plan
const eventScehma = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

// blueprint that incoorporates the plna that creates an object
// mongoose.model('Collection-Name', schema-here)
module.exports = mongoose.model('Event', eventScehma)
