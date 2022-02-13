import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://quranesk-api.herokuapp.com/",
    cache: new InMemoryCache(),
});

export default client;