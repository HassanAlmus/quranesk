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
    url: "https://quranesk-api-2.herokuapp.com/",
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return { headers: {} };
    },
  });
  const client2 = createClient({
    url: "https://quranesk-api-3.herokuapp.com/",
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return { headers: {} };
    },
  });
  
  export { client, client2, ssrCache };