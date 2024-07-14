const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  db.once('open', () => {
    app.listen(3001, () => {
      console.log(`API server running on port 3001!`);
      console.log(`Use GraphQL at http://localhost:3001${server.graphqlPath}`);
    });
  });
};

startServer();