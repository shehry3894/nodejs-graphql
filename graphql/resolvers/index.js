const bcrypt = require('bcrypt') // encrypt a string

const User = require('../../models/user')
const Event = require('../../models/event')

const tempUserID = '60c27a36616ff83da89a9e4e' // copied ID of exisitng from DB for testing

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator)
      }
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    if (!user) throw Error('User not found!')

    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user.createdEvents)
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event._doc.creator)
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  createEvent: async args => {
    const newEvent = new Event({
      title: args.eventInput.title,
      desc: args.eventInput.desc,
      price: +args.eventInput.price,
      date: new Date().toISOString(),
      creator: tempUserID
    })
    try {
      const creator = await User.findById(tempUserID)
      if (!creator) throw new Error(`User(${tempUserID}) does not exist!`)

      const result = await newEvent.save()

      creator.createdEvents.push(newEvent)
      await creator.save()

      return {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(newEvent._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })
      if (existingUser) throw new Error('User already exists!')

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      })
      return newUser.save()
    } catch (err) {
      console.log(err)
    }
  }
}
