import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { Provider } from "urql";
import * as ga from "../lib/gtag";
import "../styles/globals.scss";
import "../styles/mixins.scss";
import "../styles/this.scss";
import { client } from "../urql-client";

export default function App({ Component, pageProps }) {
  useEffect(() => (document.documentElement.lang = "en-us"), []);

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        id=""
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id= UA-221050684-1`}
      />
      <Script
        id=""
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ' UA-221050684-1', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/719941252090691705/825624790953754624/logo.png"
        />
        <meta name="theme-color" content="#007B80"></meta>
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/logo.png"
        ></link>
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/logo.png"
        ></link>
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/logo.png"
        ></link>
        <link rel="apple-touch-icon-precomposed" href="/logo.png"></link>
        <link rel="shortcut icon" href="/logo.png"></link>
        <meta
          name="description"
          content="The Holy Quran accompanied by Tafseers, Recitations and Translations in 9 languages all by Shia authors and reciters and available in an easy application. Learn the Quran with word translation, tramsliteration and pronunciation. | Quranesk.com"
        ></meta>
        <meta
          name="og:description"
          content="The Holy Quran accompanied by Tafseers, Recitations and Translations in 9 languages all by Shia authors and reciters and available in an easy application. Learn the Quran with word translation, tramsliteration and pronunciation. | Quranesk.com"
        ></meta>
      </Head>
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
