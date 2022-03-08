const express = require('express');

//import apollo server and auth middleware
const { ApolloServer } = require("apollo-server-express")
const { authMiddleware } = require("./utils/auth")
const path = require('path');
const db = require('./config/connection');

//disabled routes
//const routes = require('./routes');

//keep app and PORT as-is
const app = express();
const PORT = process.env.PORT || 3001;

//import typedefs and resolvers
const { typeDefs, resolvers } = require("./schemas")

//create Apollo server
//Apollo server gets our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

//Apollo and Express integration as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//disable routes
//app.use(routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build"));
});

db.once('open', () => {
  app.listen(PORT, () => {
  console.log(`🌍 Now listening on localhost:${PORT}`)
  console.log(`graphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});
