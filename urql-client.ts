import {
    createClient,
    ssrExchange,
    dedupExchange,
    cacheExchange,
    fetchExchange,
  } from "urql";
  
  const isServerSide = typeof window === "undefined";
  const ssrCache = ssrExchange({ isClient: !isServerSide });
  const client = createClient({
    url: "https://quranesk-api-38b3e0683878.herokuapp.com/",
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return { headers: {} };
    },
  });
  
  export { client, ssrCache };