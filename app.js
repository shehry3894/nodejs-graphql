const express = require('express')
const bodyParser = require('body-parser') // parse coming json bodies
const { graphqlHTTP } = require('express-graphql') // {} object de-structuring, middleware

const mongoose = require('mongoose') // ODM for mongoDB

const gaphqlSchema = require('./graphql/schema/index')
const gaphqlResolver = require('./graphql/resolvers/index')

const isAuth = require('./middlewares/is-auth')

const app = express()

// middleware
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.send('Hello!')
})

// middleware
app.use(isAuth)

app.use('/graphql',
  graphqlHTTP({
    schema: gaphqlSchema,
    rootValue: gaphqlResolver,
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
