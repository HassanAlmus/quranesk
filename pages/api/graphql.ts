import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../src/server/graphql/typeDefs";
import { resolvers } from "../../src/server/graphql/resolvers";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer;
  const apolloHandler = apolloServer.createHandler({ path: "/api/graphql" });
  return apolloHandler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

