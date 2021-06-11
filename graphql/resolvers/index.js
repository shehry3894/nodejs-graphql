const bcrypt = require('bcrypt') // encrypt a string

const User = require('../../models/user')
const Event = require('../../models/event')

const tempUserID = '60c27a36616ff83da89a9e4e' // copied ID of exisitng from DB for testing

const user = (userId) => {
  return User.findById(userId)
    .then(user => {
      if (!user) throw Error('User not found!')
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: event.bind(this, user.createdEvents)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const event = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event._doc.creator)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event._doc.creator)
          }
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  },
  createEvent: args => {
    // return  so that graphql knows that the resolver is doing async op and it should wait for the result
    return User.findById(tempUserID)
      .then(existingUser => {
        if (!existingUser) throw new Error(`User(${tempUserID}) does not exist!`)
        const event = new Event({
          title: args.eventInput.title,
          desc: args.eventInput.desc,
          price: +args.eventInput.price,
          date: new Date().toISOString(),
          creator: tempUserID
        })
        let createdEvent
        return event.save()
          .then(res => {
            existingUser.createdEvents.push(event)
            createdEvent = {
              ...event._doc,
              _id: event.id,
              creator: user.bind(this, event._doc.creator)
            }
            return existingUser.save()
          })
          .then(res => {
            return createdEvent
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
        return err
      })
  },
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) throw new Error('User already exists!')
        return bcrypt.hash(args.userInput.password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            })
            return user.save()
          })
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }
}
