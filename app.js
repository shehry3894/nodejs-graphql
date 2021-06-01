const express = require('express')
const bodyParser = require('body-parser') // parse coming json bodies
const { graphqlHTTP } = require('express-graphql') // {} object de-structuring
const { buildSchema } = require('graphql') // converts string to graphql schema

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
        _id: ID
        title: String!
        desc: String!
        date: String!
      }

      type RootQuery {
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String!): String!
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ['Cycling', 'Cooking', 'Running']
      },
      createEvent: (args) => {
        return args.name
      }
    },
    graphiql: true
  })
)

app.listen(3000)
