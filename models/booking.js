const mongoose = require('mongoose')

const Schema = mongoose.Schema

// plan
const bookingScehma = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingScehma)
