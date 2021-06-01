const express = require('express')
const bodyParser = require('body-parser') // parse coming json bodies
const { graphqlHTTP } = require('express-graphql') // {} object de-structuring
const { buildSchema } = require('graphql') // converts string to graphql schema
const mongoose = require('mongoose')

const Event = require('./models/events')

const app = express()

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

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
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
        const event = new Event({
          title: args.eventInput.title,
          desc: args.eventInput.desc,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        })
        // return event so that graphql knows that the resolver is doing async op and it should wait for the result
        return event
        .save()
        .then(res => {
          return res
        })
        .catch(err => {
          console.log(err)
          throw err
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
