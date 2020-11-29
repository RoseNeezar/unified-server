import "dotenv-safe/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import createSession from "./session";
import createSchema from "./schema";
import { ApolloServer } from "apollo-server-express";

const port = process.env.PORT || 8001;

async function createServer() {
  try {
    await createSession();
    const app = express();

    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    app.use(express.json());

    const schema = await createSchema();

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({
      app,
      cors: { origin: "http://localhost:3000", credentials: true },
    });

    app.listen({ port }, () => {
      console.log(
        `server running on http://localhost:${port}${apolloServer.graphqlPath}`
      );
    });
  } catch (err) {
    console.log(err);
  }
}

createServer();
