import {
    createClient,
    ssrExchange,
    dedupExchange,
    cacheExchange,
    fetchExchange,
  } from "urql";
  
  const isServerSide = typeof window === "undefined";
  const ssrCache = ssrExchange({ isClient: !isServerSide });
  const url =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    (isServerSide ? "http://localhost:3000/api/graphql" : "/api/graphql");
  const client = createClient({
    url,
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return { headers: {} };
    },
  });
  
  export { client, ssrCache };