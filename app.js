const express = require('express')
const bodyParser = require('body-parser') // parse coming json bodies
const { graphqlHTTP } = require('express-graphql') // {} object de-structuring, middleware
const { buildSchema } = require('graphql') // converts string to graphql schema
const mongoose = require('mongoose') // ODM for mongoDB
const bcrypt = require('bcrypt') // encrypt a string

const User = require('./models/user')
const Event = require('./models/event')

const app = express()

const tempUserID = '60b7ad2fada9331972e05246' // copied ID of exisitng from DB for testing

// middleware
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.send('Hello!')
})

// middleware

// app.use('/grapghql', graphqlHTTP({
//   schema: "graphql schema here",
//   rootValue: "resolvers here",
//   graphiql: "True to have graphql dashboard"
// }))

app.use('/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    
      type Event {
        _id: ID!
        title: String!
        desc: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        desc: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event
          .find()
          .then(events => {
            return events
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      },
      createEvent: args => {
        // return  so that graphql knows that the resolver is doing async op and it should wait for the result
        return User.findById(tempUserID)
          .then(user => {
            if (!user) throw new Error(`User(${tempUserID}) does not exist!`)
            const event = new Event({
              title: args.eventInput.title,
              desc: args.eventInput.desc,
              price: +args.eventInput.price,
              date: new Date().toISOString(),
              creator: tempUserID
            })
            return event.save()
              .then(res => {
                user.createdEvents.push(event)
                return user.save()
              })
              .then(res => {
                return event
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
    },
    graphiql: true
  })
)
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
